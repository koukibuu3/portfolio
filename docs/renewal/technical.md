# 技術設計

2026-10-21 / v0.11 / 1ページ型＋両テーマ＋カード・タイムラインの実装構成。実装結果と残る公開前確認は[evidence/implementation-review.md](evidence/implementation-review.md)を参照。

## リリース範囲の更新（2026-10-21）

今回のリリースはProjectsを画像・名前・概要の静的なカードとし、モーダル・詳細リンク・矢印・ホバー強調・JavaScript無効時の代替詳細を表示しない。旧`?project=...`でもモーダルを開かず、旧`#project-...`はProjects一覧へ移す。以下のモーダル設計は再検討用に保持するが、今回のリリースには適用しない。比較用モックはv0.11の記録として保持する。

## 1. 技術選定

| 項目 | 推奨 | 理由・制約 |
| --- | --- | --- |
| Framework | Next.js App Router継続 | 記事URL・React資産・Vercel配信を維持し、全面移行を避ける |
| Rendering | ビルド時生成（SSG）中心 | 閲覧時のCMS・フィード取得をなくす |
| Hosting | 現行Vercel継続 | 公開HTTPヘッダーでVercelを観測。契約・Git連携設定は別途確認 |
| Language / UI | TypeScript / React | 現行構成を継続。版はNextの対応組み合わせで更新する |
| Styling | CSS変数＋プレーンCSS | 確定モックのCSSを移植し、トークンを一元化。使わなくなったTailwind・旧UI部品を除去 |
| Content | TypeScript＋公開記事HTML/JSON＋外部記事JSON | 小規模の構造化情報と既存HTMLの保存を分ける。MDX実行基盤を加えない |
| Dialog | ネイティブ`dialog.showModal()`をReactで制御 | フォーカス境界と背景inertを利用。復帰・URL・スクロールは明示制御 |
| External sync | Nodeスクリプト、閲覧処理から独立 | 成功済みJSONを入力として常にビルド可能にする |
| Sitemap / RSS | Next Metadata API＋静的GET Route Handler | 正規ドメインと公開記事一覧を単一のデータから生成 |

Astroへの移行は静的サイトとして有力だが、既存URL・HTML・画像・運用の移行に加えてルーティングとUI基盤も置き換えることになる。今回の規模ではNext継続を優先する。CMS継続＋ISRは移行量を減らせるが、定期更新を必要としないサイトにCMS・鍵・実行時障害の依存が残るため最終構成には選ばない。

現在の`next@15.0.7`、React 18、TypeScript 4.9、Node 20.17.0をそのまま新基盤として固定しない。実装開始時に[Nextのサポートポリシー](https://nextjs.org/support-policy)と依存互換性を再確認し、サポート中の安定版・対応React・対応Node LTSへ更新する。Canaryは使用しない。バージョン更新は独立した差分にし、ロックファイルも更新する。`next lint`依存のスクリプトも対応版のESLint CLIへ移す。

### SSGと静的exportの区別

初回は`output: 'export'`を指定せず、Vercel上で静的生成されたページを配信する。Next側の互換リダイレクトと画像最適化を利用できる。SSGを採用したことだけで「サーバー機能ゼロ」とは表現しない。独立した静的ホストへの移行は今回の対象外。

[静的exportの公式制約](https://nextjs.org/docs/app/guides/static-exports)にはリダイレクト・動的機能・標準画像最適化などの制限があるため、`output`だけを切り替えない。[generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)で記事・ページ番号を列挙し、生成されていないIDは404にする。

## 2. データの流れ

```text
content/profile.ts ────────────────┐
content/projects.ts ───────────────┤
content/activity.ts ───────────────┤
content/legacy/articles/*.json ────┤→ 検証・正規化 → next build → Vercel
content/legacy/bodies/*.html ──────┤                    ↓
content/generated/writing.json ───┘          単一ポートフォリオ /#projects 等
                                                    /articles/<既存ID>

Zenn RSS / Qiita API → sync:writing → 既存snapshotへマージ → JSON差分レビュー
microCMS → 初回のみexport:legacy → 件数・本文・画像の照合 → 公開snapshot
```

通常の`build`はネットワークからコンテンツを取得しない。同期とビルドを別コマンドにする。外部サービスが停止していても、保存済みデータから表示・再ビルドできる。依存パッケージのインストールは通常どおり別途ネットワークを要する。

## 3. コンテンツ契約

以下は型の設計例。実装時はビルド前の実行時検証も行う。TypeScriptの型だけでJSONを信頼しない。

```ts
type Project = {
  slug: string // 一意、変更時は旧slugとの対応を維持
  name: string
  summary: string
  category?: string
  image?: { src: string; alt: string; width: number; height: number }
  developmentType?: string
  status?: string // 明示設定のみ。更新日時から推定しない
  roles?: string[]
  stack?: string[]
  background?: string
  highlights?: string[]
  links?: { kind: 'official' | 'source' | 'other'; label: string; url: string }[]
}

type ProjectCollection = {
  projects: Project[] // 基本の表示順
  featuredSlugs: string[] // Projectsの先頭に置く順。原則3件、重複不可
}

type WritingItem = {
  id: string // local:<旧ID> / zenn:<記事ID> / qiita:<記事ID>
  source: 'local' | 'zenn' | 'qiita'
  title: string
  url: string // localは/articles/<既存ID>、外部は公開https URL
  publishedAt?: string // ISO 8601。RSSで欠落時は未設定
  updatedAt?: string
  description?: string // プレーンテキストのみ
  tags?: string[]
}

type LegacyArticle = {
  id: string // microCMSの公開IDをそのまま保持
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  mainImage?: { src: string; alt: string; width: number; height: number }
  bodyFile: string // 移植・検証済みHTML。JSONへ本文を重複保存しない
}

type ManualActivity = {
  id: string
  date: string // YYYY-MM-DD
  title: string
  target:
    | { type: 'project'; slug: string }
    | { type: 'writing'; writingId: string }
    | { type: 'link'; url: string }
}

type ProjectRelease = {
  projectSlug: string
  publishedOn: string // 実際の公開日を確認して明示登録
  title?: string
}
```

- Profileは簡潔な紹介文、2つのFocus、リンク、Experienceの構造化データで管理する。旧Philosophyの内容はFocusへ集約し、同じ説明を二重出力しない。
- Experienceは会社ごとの期間・雇用区分・役割・説明・任意の参画案件配列を持つ。期間重複を禁止するバリデーションは行わない。
- 必須文字列の空白、slug重複、存在しないFeatured・Activity参照、危険なURLスキーム、無効な日付は検証エラー。
- 任意配列は空でも省略と同じ扱い。任意情報なしのProjectも有効とする。
- 非公開リポジトリのURL、下書き記事、draftKey、鍵をコンテンツへ出力しない。
- 外部リンクは`https:`を基本とする。内部パスは`/`始まりだけを許し、`//`や`javascript:`を拒否する。
- Projectの詳細データをUIから独立させ、将来の詳細ページでも同じデータを利用できるようにする。

## 4. 外部記事の同期・保存

### 取得元

- Zenn: `https://zenn.dev/koukibuu3/feed?all=1`を候補とし、初回に実データを検証する。[公式RSS仕様](https://zenn.dev/zenn/articles/zenn-feed-rss)ではユーザーフィードと全件指定を提供。記事パスだけを対象とし、本・スクラップは今回のWriting対象へ混ぜない。Publication配下の記事も記事ID・実URLで保持する。
- Qiita: [公式API](https://qiita.com/api/v2/docs)の`GET /api/v2/users/koukibuu3/items`。`per_page=100`でページを進め、最終ページまで取得する。公開データのみを扱い、未認証の枠内で運用。必要になった場合だけCI側の読み取り用認証を検討する。
- 現行のZennは標準フィードのみ、Qiitaは最初の1ページのみなので、その取得結果を全件として移行しない。

### 正規化と重複排除

1. 各取得元を独立実行。1リクエスト10秒、429・5xx・通信断は最大2回再試行。`Retry-After`を優先し、ジョブ全体は5分を上限とする。
2. XML/JSONの形、公開URL、記事ID、タイトルを検証する。巨大レスポンスはサイズ上限（初期5MB）で中止する。
3. `source + native ID`でupsert。URLはフラグメント・既知の追跡パラメータのみ除去し、記事の識別に必要なqueryは保持する。
4. 同一canonical URLは1件にまとめる。ZennのPublication変更等は同じ記事IDで更新する。別媒体の同名記事はタイトルだけで統合せず、明示的な重複指定を利用する。
5. フィードから消えた記事を自動削除しない。削除・非公開化は明示的な除外IDで反映する。初回同期で既存ページにしかない記事がないか照合する。
6. 公開日降順。同日・同時刻はID昇順で安定化。更新日で新着扱いにしない。日付がない記事は末尾。
7. 成功した取得元の差分だけマージし、失敗した取得元は旧データを保つ。空レスポンス・大量消失で既存内容を上書きしない。
8. 一時ファイルに書き、全体検証後にatomic rename。ログは件数・種別・失敗理由だけとし、本文や認証値を含めない。

snapshotはバージョン付きJSONとし、正規化済み記事だけを保持する。取得時刻だけの変化では差分を作らず、取得ログはCI出力へ分離する。外部記事の本文HTMLは保存・配信しない。

### 更新タイミングと障害時

初回の必須構成は`npm run sync:writing`による手動実行と保存済みsnapshot。公開済みsnapshotがない場合はリニューアル前の公開記事を初期登録する。ビルド中の暗黙fetchをフォールバックにしない。

継続運用ではGitHub Actionsの毎日06:00 JST（21:00 UTC、ベストエフォート）と手動起動を推奨する。差分がある時だけ専用の同期PRを作成／更新し、変更がなければ通知しない。PRは1本を再利用し、マージ後に通常の公開フローへ渡す。新着が自動的に即公開される方式ではなく、公開時刻はマージに依存する。

全取得元の失敗や部分失敗はジョブで確認できるようにする。部分成功時のPRには失敗元を記載するが、サイトには旧データを表示する。スケジュール停止に備え手動起動手順を残す。[GitHubのイベント制約](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)を踏まえ、bot作成PRの検証起動・必要な承認・ブランチ保護との整合を実装時に確認する。自動マージは初期構成に含めない。

## 5. Recent Activity

`WritingItem`の新規公開、明示された`ProjectRelease`、手動活動を共通表示モデルへ変換し、最大4件を公開日降順の`ol`へ表示する。ActivityTimelineは日付・種別・タイトルの静的HTMLとし、軸と点はCSSの疑似要素で描く。スクロール監視やタイムライン用ライブラリは加えない。

Projectのファイル更新を「公開」に変換しない。4件の初期Projectは公開日が未確認なので、自動活動を捏造しない。記事と手動活動の参照が同じ場合は、手動のタイトル・日付を優先して1件だけ表示する。日付のない記事はActivityに含めない。記事は直接その記事へ、Projectは`/?project=<slug>#projects`へリンクする。すべての活動を無理にWritingへ集約しない。

## 6. ルート・ナビゲーション・テーマの責務

```text
src/app/
  layout.tsx                   共通Header / Footer / Metadata / ThemeInit
  page.tsx                     単一ポートフォリオ（静的）
                               #home / #projects / #writing / #about
  articles/[id]/page.tsx       保存済み旧記事、全IDを列挙（静的）
  api/rss/route.ts             既存URLを継続、静的GET
  api/articles/route.ts        互換期間のみ、保存済み記事のJSON
  sitemap.ts / robots.ts       正規ドメインで生成
src/components/
  site/                       Header / AnchorNavigation / ThemeSelector / Footer
  activity/                   ActivityTimeline（静的、ol＋time）
  projects/                   ProjectCard / ProjectDetails / ProjectDialogController
  writing/                    WritingRow / WritingHistory（native details）
  about/                      ExperienceTimeline
src/content/                  表示用selector、実行時検証、共通型
content/                      公開コンテンツ。秘密情報を置かない
scripts/                      初回export、記事同期、コンテンツ検証
```

Projects / Writing / Aboutの独立ページは作らず、既存の独自記事本文のみ別ページとして残す。`/projects`等の互換を設ける場合はアンカーへのredirectとする。DB、認証、新規CMS、状態管理ライブラリは追加しない。

### クライアント境界

本文・カード・記事一覧・ExperienceはServer Componentで静的出力する。クライアント処理はスクロール現在地、テーマ切替、モーダルに限定する。全体をクライアント化して`useEffect`で記事を取りに行かない。

トップのServer Pageは`searchParams`を読まず静的生成を保つ。`useSearchParams`を使う小さなClient Controllerを`Suspense`で囲む。[公式の静的レンダリング時の注意](https://nextjs.org/docs/app/api-reference/functions/use-search-params)に従い、production buildで確かめる。Writingは最新6件と残りの記事リンクをすべてHTMLに含め、残りは`details`で展開する。初回はページネーションを持たない。

### アンカーナビゲーション

- 通常のリンクを`/#home` / `/#projects` / `/#writing` / `/#about`で出力する。同じページ内ではhashだけのリンクでもよい。既存記事からはルート付きアンカーにする。
- Headerはstickyで表示。`ResizeObserver`で高さを測り、`scroll-padding-top`に高さ＋20pxを反映する。JS無効時もCSSのブレークポイント別既定値で隠れを防ぐ。[MDNのscroll-padding-top](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-top)を参照。
- 基本はCSSの`scroll-behavior: smooth`。`prefers-reduced-motion: reduce`では`auto`、JSによる移動も即時にする。
- クリック後は対象見出しへ`focus({ preventScroll: true })`し、スクロールは別に行う。手動スクロールでフォーカスを動かさない。
- 現在地はスクロール位置から導出し、`aria-current="location"`と下線を同期する。スクロール監視はrequestAnimationFrameでまとめる。
- hashは明示的なアンカー操作だけで更新し、手動スクロールでは変更しない。戻る・進むでアンカー位置と現在地を復元する。
- 一度に表示する全ページH1は1つ。内部セクションを別ページとして扱うタイトル変更は行わない。

### ライト／ダークテーマ

G.G. Garageの画像はトリミング済みファイルのみ配信し、一覧カードだけで使用し、詳細モーダルは画像を参照しない。未公開の元画像をCSSで隠す方式にはしない。

Projectカードは画像面と本文に分け、画像面の比率を固定して読み込み時の移動を防ぐ。画像は既存の`Project.image`で扱い、画像を持たない場合は名前の文字表現で補う。ロゴを反転せず、明るい画像面をテーマ間で共通にする。

CSS変数の同じトークン名にライト／ダークの値を定義する。`canvas` / `surface` / `soft`でセクション背景、`card-surface` / `card-line`で個別Projectの面と枠を分ける。全幅sectionの内側に共通幅のラッパーを置き、ページ全体の横はみ出しを避ける。`data-theme`と`color-scheme`をルートに適用し、背景・本文・補助文字・リンク・主操作・モーダル・backdropをまとめて切り替える。固定の白文字は`on-accent`へ置換し、ダークの明るい主操作上では濃い文字を使う。

優先順位は「保存済みの手動選択 → OSの`prefers-color-scheme` → ライト」。保存値は`light` / `dark`だけを許可し、無効値は未設定として扱う。保存キーは`portfolio-theme`。`localStorage`の読み書きは例外を捕捉し、保存不能でも画面内の切替を可能にする。[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)の利用制限を考慮する。

初回描画前の短いThemeInitスクリプトで保存済み属性を適用して明暗のちらつきを防ぐ。OSだけの判定はCSSの[`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)でも可能にする。Cookieを読む動的ページ化は不要。ThemeInitによるHTML属性の差分だけを対象にhydrationを調整し、全体の警告を抑制しない。CSPを設定する場合は初期化スクリプトのhashも設計に含める。

手動選択前はOS設定変更へ追従し、選択後はその選択を維持する。別タブからの`storage`イベントでは選択を同期する。太陽・月の2つのbuttonを`role="group" aria-label="表示テーマ"`へまとめる。各buttonの固定ラベルは「ライトモード」「ダークモード」、選択中だけ`aria-pressed="true"`とする。SVGは`aria-hidden`、操作はボタンの標準キーボード動作を使う。押すと対応するテーマを明示的に選択し、同じアイコンを再度押しても別テーマへ反転させない。JS無効時は選択UIを表示せず、OS設定のテーマで本文を読める。

### モーダルとURLの状態遷移

URLの`project`を選択Projectの唯一の状態源にする。hashはアンカー、queryは詳細選択として役割を分ける。共有の基本URLは`/?project=<slug>#projects`。ページ内で開く際は起点のhashとスクロール位置を保つ。

| 操作 | URL / 履歴 | 表示・フォーカス |
| --- | --- | --- |
| Projectsのカード | 同じURLに`project`だけ`pushState`で追加 | 同じページ位置を背景に開く |
| URL直開き・再読込 | queryから判定、背景はProjectsへ移動 | hydration時にモーダルを開く |
| 内部操作で開いたものを閉じる | 当該セッションで追加した履歴なら戻る | 元カードへフォーカスとスクロール復帰 |
| 直開きを閉じる | `replaceState`で`project`だけ除去 | Projectsを背景に残し、見出しへフォーカス |
| 戻る・進む | 履歴のqueryへ追従 | モーダルの開閉を同期。履歴を追加しない |
| 未知slug・複数project値 | 開かずそのqueryだけreplace除去 | ページ全体を表示し、他のquery・hashを保持 |

履歴の所有判定は画面セッションのtokenを用いる。`history.length`や`document.referrer`だけで戻ることを決めない。Next管理の`history.state`はマージして保持する。別タブやreloadでtokenを検証できなければ直開きとして扱う。モーダルが開いている間は背景スクロールと現在地更新を止め、閉じると再開する。復帰先カードがなくなった場合はProjects見出しへ移す。

### JSなし

カードは通常の`<a href="/?project=<slug>#project-<slug>">`として出力する。Projectsには名前・概要・任意の役割・公式リンクを持つコンパクトな代替詳細を`noscript`、またはhydration成功後にだけ隠すHTMLとして出力する。モックは`noscript`で代替詳細を含める。本実装ではJS実行失敗にも備え、代替詳細を確実に読める方式を選ぶ。

通常のアンカー、Writingの`details`、各記事・外部リンクはJSなしでも利用可能にする。URL指定のモーダル自動表示と保存済みテーマの適用はJSを要する。既存記事の詳細URLは変更しない。

## 7. 既存記事の保存

- 公開済み記事を全ページ取得し、ID・タイトル・日付・タグ・本文・画像を保存する。ドラフトAPIと公開APIのexportを混ぜない。
- HTMLをMDXへ機械変換しない。許可タグ・属性・URLを定義してsanitizeし、見出し・表・コード・リンク・注記・埋め込みの差分を確認する。
- iframeは必要な公開埋め込み先だけをallowlist化し、除去される埋め込みには元ページへのリンクを残す。スクリプト・イベント属性を持ち込まない。
- 画像は権利を確認し、mainImageだけでなく本文・srcset・リンク先を棚卸しする。保存可能なmicroCMS管理画像をローカルへ移し、参照を書き換える。外部所有画像・埋め込みは区別する。
- 本文・画像・コードに欠落があればCMS依存除去を完了扱いにしない。CMSを残した段階リリースに切り替える場合は別判断として記録する。
- 移行照合が完了するまでCMSの契約・データ・鍵を削除しない。旧プレビュー機能の廃止は保存完了後に行う。

## 8. SEO / RSS / 互換API

- `metadataBase`とサイトURLの定数を`https://koukibuu3.dev`へ統一。旧`.net`を正規URL・robots・sitemap・OGPから除く。既存RSS GUIDだけは購読互換のため保存値を維持する。
- トップのタイトルは「Kouki Akasaka | Software Engineer / Scrum Master」。1ページ共通の説明文と絶対OG画像URLを設定し、hash移動やテーマ切替では変更しない。既存記事は各記事固有のタイトル・説明を持つ。
- OGPは初回共通の1200×630画像。名前・肩書き・ドメインのみを使い、未確認の実績を入れない。既存記事は画像を保存できた場合に固有画像を使う。
- `/?project=...#projects`および各セクションのcanonicalは`/`。sitemapにはquery・hash付きURLを含めない。個別Projectのindexページ・個別OGPは初回作らない。
- sitemapはトップ1ページと既存記事全件を含める。`lastmod`はコンテンツ由来とし、毎回のビルド日時で水増ししない。
- `/api/rss`は購読互換のため残し、初回は従来どおり独自記事だけを配信する。ID・URLを維持し、日付は公開日、更新日は別に扱う。全媒体の再配信を勝手に追加しない。
- `/api/articles`はページUIからの利用を廃止するが、移行時は保存済みデータで従来の配列形を返す互換APIを残す。`page=1`、`perPage=6`を既定、範囲外は400。外部利用とアクセス状況を確認して後日廃止判断する。API内部はローカルJSONを読むだけでCMSへアクセスしない。
- `/api/preview`は新CMS運用を持たないため保存後に廃止。廃止案は410＋no-storeとし、draftKeyをログやリダイレクト先へ露出させない。
- 構造化データはPerson / WebSite、独自記事にBlogPostingを使用する。公開してよい実データだけを出力する。

## 9. 性能・検証の目標

| 対象 | 初回の目標・測定条件 |
| --- | --- |
| LCP / CLS / INP | 実ユーザー75パーセンタイルで2.5秒以下 / 0.1以下 / 200ms以下を目標。実データ不足時は未評価とする |
| ローカル検証 | production build、モバイル相当設定でLighthouseを3回測定し中央値を記録。実ユーザーINPの代替としない |
| JS | Home初回JS転送量gzip 150KiB以内を暫定予算。共有分を含み解析タグは別記。超過なら不要なClient境界を削る |
| 画像 | カードは原則150KB以下、適切な幅・sizes・寸法指定。ファーストビュー外はlazy load |
| 外部依存 | 閲覧時のCMS・Qiita・Zennへのfetchが0件。コンテンツ供給元が停止してもビルド・閲覧可能 |
| 操作 | アンカー・現在地・両テーマ・OS追従・保存・キーボード・履歴・JS無効・モーダルを確認 |

Core Web Vitalsの基準は[web.dev](https://web.dev/articles/vitals)を参照。これらは受け入れ目標であり、現行やモックで達成済みという意味ではない。

Google Analyticsは環境変数が空ならスクリプト自体を出力しない。導入継続の有無は現行設定を確認し、今回新たな行動追跡や外部送信を増やさない。

## 実装時の確定事項

Next.js 16.4.2 / React 19.3.1 / TypeScript 5.9.3 / Node 24.18.1。初回同期は公開Qiita 19件・Zenn 19件、保存した独自記事4件と統合してWriting 42件。最近の活動は公開日順の4件とする。

スクロール・履歴とJSなしの通常リンクを同じ振る舞いにするため、内部アンカーもネイティブリンクを使う。Projectの選択は小さなClient ControllerがuseSyncExternalStoreでURLを購読し、Server PageはsearchParamsを読まない。JSが利用できない場合の代替詳細はCSSの:targetで表示する。

CMSの記事本文・画像は保存済み。CMS・Qiita・Zennの旧クライアントと未使用のUI・依存を除去した。公開中RSSの4件のGUIDが.netだったことを照合し、GUID値だけを引き継ぐ。日次同期PR・ホスティング変更・本番公開は実施しない。
