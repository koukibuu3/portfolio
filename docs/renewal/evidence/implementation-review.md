# 確定デザインの実装確認

2026-10-21 / 確定デザインv0.11 / ローカルproduction build

## 実装

- Next.js 16.4.2 / React 19.3.1 / TypeScript 5.9.3、Node 24.18.1。CSS変数と確定モックのCSSを本体へ移植した。
- 単一ページのアンカーナビ、現在地、ライト／ダーク、初期化・保存・別タブ同期、Projects 4/2/1列、Recent Activityタイムライン、Writingの過去記事展開、Profile / Experienceを実装。
- Projectsの画像はカードだけに表示する。Salestackは提供SVG、G.G. Garageは元画像と画素が一致する448×280の抜粋だけを配信する。
- モーダルはURLを唯一の選択状態とし、閉じる・Escape・背景・Tab循環・履歴・フォーカス復帰を実装。未知slug・重複queryを正規化し、他のquery・hashを保持する。
- 旧UI・CMS/外部記事の実行時クライアント・未使用依存を除去。トップと4記事、RSS・sitemap・robots・OGPは静的生成。記事APIと旧一覧の互換処理だけはリクエストを扱う。
- GitHub Actionsのチェック定義を追加。実行時にCMSの鍵が必要な構成にはしていない。

## コンテンツ照合

| 対象 | 結果 |
| --- | --- |
| CMS公開API | totalCount=4 / 保存4件。全IDを照合 |
| 本文 | 全4件で公開サイトの本文と保存後の本文を正規化したテキストが一致 |
| 画像 | メイン画像4点をローカル保存し、全件HTTP 200を確認 |
| 記事URL | 既存4件でHTTP 200、未登録IDで404 |
| 外部記事 | Qiita 19件 / Zenn 19件。独自記事4件と統合してWriting 42件 |
| RSS | 公開中の4 GUIDが旧.netだったため値を保持。リンク・チャンネルURLは.devへ統一。独自記事4件のみ |
| 記事API | 既存の配列形を維持。bodyFile・rssGuidなどの内部属性を返さず、不正なページ指定は400 |
| Preview | 410 / no-store / Cookieを発行しない |
| 旧一覧 | 正のページ番号はWritingへ308。0・非数は404 |
| sitemap / robots / OGP | .devのトップ＋4記事、正しいsitemap参照、1200×630 PNGで200 |

公開記事のID・本文・メタデータは`content/legacy/`、画像は`public/content/articles/`に保存する。CMSの元データ・契約・鍵は削除していない。

## 実行したチェック

- `npm ci`: ロックファイルから再インストール成功。
- `npm run lint` / `npm run typecheck`: 成功。
- `npm test`: 10件成功。部分失敗時の保存・空配信・不正データの隔離、重複・日付・URL検証、HTMLサニタイズ、記事保存、最小Project、APIページング、JSON-LDを確認。
- `npm run build`: 成功。トップ・4記事・RSS・OGP・sitemap・robotsを静的生成。
- `npm run check:routes`: 成功。上表のURL・レスポンス・記事の代替詳細HTMLを照合。
- 記事APIの出力トレースに全4本文HTMLが含まれることを確認。
- 以前のnext-sitemapが生成したローカルpublic配下のXML・robotsを除去し、新しいMetadata Routeとの競合を解消。

## ブラウザ確認

Chromeとアプリ内ブラウザでローカルproduction serverを確認。従来の`http://127.0.0.1:4173/`も実装した本体へ切り替えた。

- 320 / 390 / 768 / 1024 / 1440pxで横はみ出しなし。列数は1 / 1 / 2 / 4 / 4。
- 全カード画像が読み込まれる。PCの両テーマ、モバイルのトップ、旧記事のカバー・本文を確認。
- アンカー移動のフォーカスとhash、再読み込み後の位置復元・ヘッダーとの余白・現在地を確認。
- テーマ手動選択の再読み込み後の保存と、別タブへの同期を確認。
- モーダルの画像0件、背景スクロール抑止、Tab / Shift+Tab循環、Escape、閉じる、内側クリック保持、背景クリックで閉じる、元カードへのフォーカス復帰を確認。
- 戻る・進むで再開閉。直リンクの再読み込み後もサイト内へ閉じ、未知／重複queryを正規化して他のquery・hashを残すことを確認。
- モバイルのモーダルは390×844pxの全画面。
- Writingを展開すると全42件のリンクが表示される。旧記事のcanonicalは自身の.dev URL、ナビ現在地はWriting。
- 確認した画面でコンソールのerror / warnなし。

[PC・ライト](implementation-projects-light-1440.jpg) / [PC・ダーク](implementation-projects-dark-1440.jpg) / [モバイル・トップ](implementation-home-dark-390.jpg) / [モバイル・旧記事](implementation-article-light-390.jpg)

## 検証の限界・公開前の確認

- GitHub Actionsは定義のみ。push・CI実行・PR作成・本番公開は行っていない。
- OSテーマを変更しての追従、保存不能のブラウザ設定、JavaScriptを無効にしたブラウザ、VoiceOver・実機Safari・Lighthouse・実ユーザーCore Web Vitalsは未検証。JSなしの代替詳細が静的HTMLに存在し、CSSの:targetで表示される構成は確認した。
- トップHTMLが直接参照する現行ブラウザ向けJSのgzip換算は約143.7KiB（nomodule専用約38.7KiBを除外）。これはファイルからの参考計測で、実ブラウザ転送量・Lighthouseの実測ではない。
- `npm audit --omit=dev`は0件。全依存では開発用のNext ESLint plugin → fast-glob → micromatch → braces系に5件のhighが残る。監査の強制修正案はNext設定の旧メジャーへの変更を伴うため適用していない。ESLintは関連pluginのpeer範囲が合う9.39.5に固定しており、上流の10系対応と合わせて更新が必要。
- 日次同期PRは未設定。初回は手動の`npm run sync:writing`を使う。
