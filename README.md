# koukibuu3.dev

Kouki Akasakaのポートフォリオ。確定デザインv0.11をNext.js App Routerへ実装し、トップページと既存記事を静的生成する。設計と確認記録は[docs/renewal](docs/renewal/README.md)を参照。

## 開発・確認

Node.jsは`.node-version`の24.18.1を使用する。

```sh
npm ci
npm run dev
```

本番と同じビルドのローカル確認:

```sh
npm run lint
npm test
npm run build
npm run typecheck
npm run start -- --hostname 127.0.0.1 --port 4173
```

[ローカルプレビュー](http://127.0.0.1:4173/)を開く。別ターミナルで`npm run check:routes`を実行すると、トップ・4記事・画像・API・旧URL・RSS・sitemap・robots・OGPを照合する。ポートを変更した場合は`PORTFOLIO_BASE_URL=http://127.0.0.1:4180 npm run check:routes`のように指定する。

## コンテンツ

- `src/content/profile.ts`: Profile / Focus / Experience / Links
- `src/content/projects.ts`: Projectsの表示順・名前・概要・画像・任意の詳細。モーダルに画像は再掲しない。
- `public/projects/`: 採用素材のみ。G.G. Garageは抜粋だけを保存する。
- `content/legacy/articles.json` / `bodies/`: 既存記事のメタデータとサニタイズ済み本文
- `public/content/articles/`: 保存したCMS管理画像
- `content/generated/writing.json`: Qiita・Zennの公開記事メタデータ
- `content/excluded-writing.json`: 明示的に掲載を外す記事ID

通常のビルド・閲覧でCMS・Qiita・Zennにアクセスしない。`npm run validate:content`をビルド前に実行し、参照や記事の欠落を検出する。新しいProjectの担当・技術・公開状態は、確認できた情報だけを設定する。

### 外部記事を更新する

```sh
npm run sync:writing
```

取得元ごとに独立して検証し、成功分だけを既存スナップショットへマージする。取得失敗・空配信・不正なデータでは、その取得元の保存済み記事を残す。フィードから消えただけでは記事を削除しない。部分失敗でも成功分は保存し、終了コード1と取得元名で失敗を知らせる。公開記事の本文は取り込まない。変更をレビューしてからコミットする。

日次の自動同期・PR作成はまだ設定していない。初回は手動同期で運用する。

### 既存CMS記事を再取得する

```sh
npm run export:legacy
```

初回移行用コマンド。ローカル`.env`に既存の`MICROCMS_API_ID` / `MICROCMS_API_KEY`があれば、公開APIの`totalCount`と全ページを照合する。なければ公開サイトの一覧を使い、完全性の確認範囲が異なることをログへ記録する。下書き・プロフィール・秘密情報は保存しない。

公開中のRSSから既存GUIDも引き継ぐ。旧`.net`のGUIDは購読互換のためにだけ保持し、記事リンク・canonical・sitemap・RSSのチャンネルURLは`.dev`とする。CMS契約・元データ・鍵はこのコマンドで削除しない。

## UI・URL

`/`にHome / Projects / Focus / Recent Activity / Writing / About / Linksを配置する。ヘッダーはHome / Projects / Writing / Aboutへスクロールする。太陽・月でテーマを選び、手動選択を`localStorage`へ保存する。初回はOS設定に従う。

ProjectsはPC4列・タブレット2列・スマホ1列。詳細は`/?project=<slug>#projects`で共有でき、閉じる・Escape・背景クリック・履歴・フォーカス復帰に対応する。JSなしではカードの通常リンクから同じページの代替詳細へ移動する。

- `/articles/<既存ID>`: 4件のIDを維持。未登録IDは404
- `/knowledge/pages/<正の整数>`: `/#writing`へ308。0・負数・非数は404
- `/projects` / `/writing` / `/about`: 対応アンカーへ308
- 旧`#article` / `#articles` / `#knowledge`: Writingへ移動
- 旧`#slide` / `#slides`: Slides終了の案内を表示。外部のスライドサイトと関連記事は維持
- `/api/articles`: 従来の配列形をローカル保存データで返す。`page=1`・`perPage=6`が既定
- `/api/rss`: 従来どおり独自記事のみ
- `/api/preview`: 410 / no-store。draftKeyの処理を廃止

独自記事本文は移行時に許可タグ・属性・iframeホストでサニタイズする。公開HTMLを変更した場合は再検証する。

## 環境変数と公開

通常のビルドにCMS・Qiitaの鍵は不要。既存のGoogle Analyticsを使う場合のみ、有効な`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`（`G-...`）を設定する。未設定ならスクリプト自体を出力しない。

Vercelへ配置できる通常のNext.jsビルドとし、`output: export`は指定しない。`.github/workflows/check.yml`でlint・テスト・ビルド・型検査を定義している。ホスティング設定変更・本番公開・CMS解約は別作業。
