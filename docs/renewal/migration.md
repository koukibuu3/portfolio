# 現状調査・移行と実装計画

調査日: 2026-10-21 / 設計v0.4（1ページ型・テーマ対応・コピー簡潔化） / 対象: ローカルmain相当の作業ツリーと公開サイト

## 1. 確認した現状

| 対象 | 確認結果 | 設計への反映 |
| --- | --- | --- |
| `package.json` | Next 15.0.7 / React 18.3.1 / TypeScript 4.9.5 / Tailwind 3.3.3 | Framework継続、実装時に対応版へ更新 |
| `.node-version` | 20.17.0 | Nextの採用版に合わせて更新 |
| `src/app/page.tsx` | CMS記事・外部記事・プロフィール・Slidesを`Promise.all`取得 | コンテンツ供給元から独立した静的生成へ |
| `src/app/articles/[id]/page.tsx` | microCMS＋draftMode、記事IDルート | ID維持。保存後にdraft依存を除去 |
| `ArticleRepository` | 一覧のoffset/limit取得、本文から概要生成 | 全件のexportと公開日による並び順が必要 |
| `qiitaClient` | 認証付きAPI、ページング指定なし | 初回の全件回収と認証不要の公開取得を検討 |
| `zennClient` | ユーザーRSS、通常フィード | 過去記事の保存と全件指定を確認 |
| `KnowledgeRepository` | 外部2取得元の`Promise.all`、取得後ページング | 失敗元だけ旧snapshotを残す |
| `SlideRepository` | 別GitHub PagesからJSON取得 | 呼び出しとナビを除去。外部Slidesサイトは変更しない |
| `GlobalNavigation` | 全幅ハンバーガー、`/#articles`・`/#slides`等 | 4リンクのアンカーナビ＋テーマ切替。古いhash互換を考慮 |
| `next-sitemap.config.js` | 未指定時`https://example.com`、記事ID列挙なし | 正規URLの定数と全記事のsitemap |
| 公開配信 | `server: Vercel`、キャッシュ済みHTMLを観測 | Vercel継続。管理画面の設定までは未確認 |
| 公開sitemap / robots | `koukibuu3.net`を参照 | `.dev`へ統一して公開後にreadback |
| `.github/workflows` | 作業ツリーには存在しない | CI・同期ジョブは新設設計。既存CIがあると仮定しない |

参照した主要ファイルは上表のほか、`src/app/layout.tsx`、`src/app/api/{articles,rss,preview}/route.ts`、`src/components/ArticleDetail/Body.tsx`、`src/types/{Article,Knowledge,Profile}.ts`。

### 公開独自記事の観測一覧

公開Homeと`/api/articles?page=1&perPage=100`で次の4件を確認した。APIの返却にtotalCountがないため、microCMS側の公開全件照合を別に行う。

| 維持するパス | タイトル | 公開日（JST日付） |
| --- | --- | --- |
| `/articles/58u0ek2oawuk` | 7年務めた会社を辞めて、初めての転職をします。 | 2025-04-30 |
| `/articles/1ipcx2fh69e8` | ブログにスライド閲覧機能を追加する：Slidev の活用法 | 2025-03-27 |
| `/articles/z7g19vk5jecr` | なぜリポジトリはエンティティ単位で設計すべきなのか？ | 2025-03-20 |
| `/articles/7hltyl68nznj` | コード品質を高める！明日から使えるGitのコミット3つのコツ | 2025-01-02 |

Slidesについて書かれた既存記事も保持する。Slides UIの廃止を理由に記事本文を削除しない。

### 外部プロフィール

公開Homeのリンク先を確認した。

| サービス | 確認済みURL |
| --- | --- |
| GitHub | `https://github.com/koukibuu3` |
| Zenn | `https://zenn.dev/koukibuu3` |
| Qiita | `https://qiita.com/koukibuu3` |
| X | `https://twitter.com/koukibuu3`（現行値。ドメイン変更だけを推測で行わない） |

### Projectの初期台帳

| slug案 | 表示名 | 提供仕様の概要 | 残る確認 |
| --- | --- | --- | --- |
| `salestack` | Salestack | 業務支援Webアプリケーション | 正式説明・担当・LP・画像 |
| `scrum-workbench` | ScrumWorkbench | スクラムイベントの準備・進行支援ツール | 表記・LP・担当・画像 |
| `gg-garage` | G.G. Garage | 共同ゲーム開発プロジェクト | チーム名／作品名の関係・公式導線・担当・画像 |
| `core-uma` | Core Uma | 食品・飲料の口コミサービス | 正式名称・公開状況・公式導線・担当・画像 |

`gh repo view`で確認したSalestack / Scrum Workbench / Core Umaのリポジトリは非公開。リポジトリのhomepageはStorybookであるものもあり、公開LPとして転記しない。個人・共同の区分や技術は、リポジトリの存在だけで推定して公開しない。

## 2. URL移行表

| 現行のURL・経路 | 初回の対応 | 注意事項 |
| --- | --- | --- |
| `/` | 新Homeへ置換 | 新規サイトへ別ドメイン移動しない |
| `/articles/<id>` | そのまま200、本文保存 | 存在しないIDは404 |
| `/knowledge/pages/<正の整数>` | `/#writing`へ恒久リダイレクト（308） | 統合後は順序・1ページ件数が違うため同番号へ機械対応しない。旧一覧URLの主目的を一覧で受ける |
| `/knowledge/pages/0`・非整数等 | 404 | 無限パスをリダイレクトで有効化しない |
| `/#article`・`/#articles` | `#writing`への互換導線 | hashはHTTPへ送られないのでサーバーredirect不可 |
| `/#knowledge` | `#writing`への互換導線 | 同上 |
| `/#about` | `#about`をそのまま維持 | 同上 |
| `/projects`・`/writing`・`/about` | `/#projects`・`/#writing`・`/#about`へ308案 | v0.1の設計上のパス。公開済みとは扱わず、先行共有URLの互換として必要なら用意 |
| `/#slide`・`/#slides` | Home上の小さな互換案内 | Slidesが終了した旨とHomeへの導線。Writingへ意味なく転送しない |
| `/api/rss` | 維持 | 既存購読のID・URL・対象を維持 |
| `/api/articles` | snapshotによる互換APIを維持 | 利用状況を確認した後、廃止判断を別途行う |
| `/api/preview` | 保存後に410案 | 下書きプレビュー運用を終える時点で切り替える |
| `/slides` | 現行ルート未発見 | 本番アクセス等で存在・参照を確認してから判断。新設しない |
| `koukibuu3.github.io/slides/...` | 変更しない | このリポジトリのページではない |
| `.net`上の旧URL | 管理権・配信・流入を確認 | このリポジトリ変更だけで旧ドメインredirectが完了したとしない |

hash互換はHomeの小さなクライアント処理で初回hashを読み、上記の新アンカーへreplaceする。JSなしではHome末尾の互換リンクへスクロールできるよう該当IDを持つ案内を置く。案内は対象hashの時だけ`:target`で表示し、通常のHomeへ説明を増やさない。Slidesの案内から外部資料へのリンク集は作らない。

現行ナビは`#articles`と`#slides`、本文のIDは`#article`と`#slide`で不一致があるため、単数・複数の両方を考慮する。旧hash処理を過剰な汎用routerにしない。`#about`はそのまま利用し、遷移処理を挟まない。

## 3. 実装順序

| 段階 | 作業 | その段階の完了条件 |
| --- | --- | --- |
| A: 基盤と保存 | サポート版への依存更新、lint/typecheck/build基盤、旧記事・画像のexport、ID台帳 | 公開全記事を保存・照合、旧記事URLを生成可能 |
| B: コンテンツ | Project / Profile / Experience / Activityの契約、公開用データ、外部記事snapshot | 必須情報だけで4件が検証に通る。未確認情報を公開データへ入れない |
| C: 1ページとテーマ | 両テーマのトークン、追従Header、アンカーと現在地、Home/Projects/Writing/About、記事共通レイアウト | PC・狭幅・両テーマで背景境界・カード・Activityタイムライン・アイコン選択と本文を確認 |
| D: モーダル | URL連動、履歴、フォーカス、背景制御、JSなし詳細 | 操作マトリクスをproduction buildで通す |
| E: 互換とSEO | 旧一覧redirect、hash互換、RSS/API、canonical/OGP/sitemap/robots | 旧URL台帳と新ルートのHTTP結果が一致 |
| F: 更新運用 | 同期スクリプト、取得失敗・部分成功・重複の検証、必要なら日次同期PR | 外部停止でも旧データ表示。手動の復旧・削除手順を記録 |
| G: 公開準備 | 公開内容の確認、preview検証、実画像・性能確認、戻し手順 | 完了条件を満たし、公開判断を受けられる |

各段階をレビュー可能な変更に分ける。CMSを外すために記事URLの互換を後回しにしない。外部自動同期が間に合わなくても、保存済みWritingと手動同期で初回公開は成立する。

## 4. 検証計画

### データ・ユニット

- 最小Projectで空見出し・空操作が出ない。Featured指定を先頭にして全4件が重複なく並ぶ。
- 記事は媒体IDで重複排除され、同名別記事を失わない。日付欠損・同日が安定する。
- Zenn失敗・Qiita失敗・両方失敗・空配信・壊れたXML/JSONで旧snapshotを保持する。
- フィード上限から落ちた記事が消えない。除外IDだけは意図どおり消える。
- Project公開活動と手動活動が重複せず、ファイル更新だけで活動が追加されない。
- 旧記事HTMLの許可要素と禁止要素、画像置換、内部URLが保たれる。

### ブラウザ・E2E

| 経路・条件 | 期待 |
| --- | --- |
| 各アンカーナビ → 対象セクション | 同じページ内でスクロール、見出しがHeaderに隠れず現在地が同期 |
| 手動スクロール・戻る・進む | 現在地が追従、手動移動だけではhashや履歴を増やさない |
| OSテーマ・太陽／月の選択・reload・保存不能 | 初回OS、選択の保存・優先、保存不能でも画面内の切替が可能 |
| Projectsカード・Activity・背景境界 | 各制作物が独立した面で表示、Activityは新しい順の縦軸、隣接セクションは異なる背景 |
| Projectsのカード → 閉じる | 同じページ上のモーダル、元の位置・カードへ復帰 |
| Projects → 4件 → 戻る・進む | URLと開閉が一致、一覧のスクロール保持 |
| query直開き → reload → 閉じる | 外部サイトへ戻らずProjectsへ閉じる |
| 不正slug・重複query | 一覧が表示され、履歴を増やさず正規化 |
| Escape・閉じる・背景クリック | 同じ閉じる結果、背景への誤操作なし |
| Tab / Shift+Tab | フォーカスがダイアログ内で循環、閉じると適切に復帰 |
| 320 / 390 / 768 / 1440px | 横はみ出しなし、モバイルは全画面、長文も閉じられる |
| JS無効 | 本文・カード・簡潔な詳細・記事と外部リンクが利用可能 |
| 旧4記事・旧一覧・旧hash | 想定HTTP結果、記事本文・画像・アンカーの保持 |

画像あり／なし、外部LPあり／なし、名前・概要だけ、長い技術名と本文を含むデータを用意する。axe等の自動検査に加え、VoiceOverと実機Safariの操作を公開前に確認する。ブラウザエミュレーションだけで実機検証済みとは記録しない。

## 5. 公開ゲートと戻し方

1. Projectの公開情報、経歴・案件説明、記事・画像保存の照合を完了する。
2. lint / typecheck / production build / 必要なテストを通す。
3. Previewで旧URL、単一ページの全セクション・両テーマ、canonical、OG画像、RSS、sitemap、robotsを確認する。Previewは本番とは別の証拠とする。
4. ホスティングのGit連携・ドメイン・redirect設定を確認する。公開操作は別の許可された作業で実施する。
5. 公開後にHTTP応答、4記事と画像、モーダル、sitemap/robotsの`.dev`、OGPをreadbackする。
6. 問題があればVercelの前の正常デプロイに戻すか、変更コミットをrevertして再公開する。初回記事exportと旧環境をそれまで保持する。

CMS契約の停止・秘密情報の廃止・旧ドメインの設定変更は、表示移行の完了と切り離して確認する。実装・Preview確認・CI成功・公開・実機確認を別々に記録する。

## 実装結果（2026-10-21）

確定デザインv0.11を本体へ実装した。CMS公開記事はtotalCount=4と全4件・画像4点を照合し、本文テキストも公開サイトと一致。Qiita・Zennは公開メタデータを保存し、ビルド時・閲覧時の外部コンテンツ取得を除去した。ローカルproduction buildと操作・URL検証は[実装記録](evidence/implementation-review.md)を参照。本番公開・実機・VoiceOver・Lighthouseはこの記録と区別する。
