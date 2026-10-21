# koukibuu3.dev リニューアル設計

作成日: 2026-10-21 / 確定デザイン v0.11 / 対応仕様: v1.0＋2026-10-21の追加指示

## 推奨する方向

名前・職種・制作物・経歴を中心に、短く具体的に伝える。説明用の前置きやキャッチコピーは画面から外し、FocusとAboutの重複を整理する。ライト／ダーク、背景面の区切り、Projectカード、Activityタイムラインは継続する。

ポートフォリオは`/`の1ページに集約し、Home / Projects / Writing / Aboutへアンカースクロールで移動する。既存のNext.js App Routerを継続し、ページはビルド時に生成する。新しいコンテンツはTypeScriptで管理し、既存の独自記事はHTMLとメタデータを保存してURLを維持する。外部記事の収集は閲覧リクエストから切り離す。

2026-10-21にユーザーがデザインを確定し、本体への実装を承認した。追加指示で1ページ型とライト／ダーク対応へ変更した。[変更仕様](requirements-update.md)を優先し、[当初の仕様書](requirements-v1.md)は原本として保存する。アプリ本体の実装・依存更新・既存記事の保存を実施した。実行方法は[ルートREADME](../../README.md)、結果は[実装の確認記録](evidence/implementation-review.md)を参照。外部サービスの設定変更・本番公開は実施していない。

## 成果物

| ファイル | 用途 |
| --- | --- |
| [requirements-v1.md](requirements-v1.md) | 提供仕様書の原本コピー |
| [requirements-update.md](requirements-update.md) | 1ページ型・テーマ対応の確定した変更点 |
| [copy.md](copy.md) | 簡潔なコピーの方針と画面の文言 |
| [design.md](design.md) | ビジュアル、1ページの各セクション、レスポンシブ、操作・状態設計 |
| [technical.md](technical.md) | 技術選定、データ契約、外部取得、URLとモーダル、SEO |
| [migration.md](migration.md) | 現状調査、URL移行表、実装順序、検証・公開手順 |
| [prototype/index.html](prototype/index.html) | 1ページのスクロールとテーマ・詳細ダイアログを操作できるデザインモック |
| [evidence/verification.md](evidence/verification.md) | 実施した確認と未確認の範囲 |

## 確定モックの確認（設計参照用）

リポジトリのルートで以下を実行し、`http://localhost:4174/` を開く。

```sh
python3 -m http.server 4174 --bind 127.0.0.1 --directory docs/renewal/prototype
```

Home / Projects / Writing / Aboutをクリックすると、同じページの`#home` / `#projects` / `#writing` / `#about`へスクロールする。スクロール位置に応じたナビの表示、右上の太陽／月アイコンによるライト／ダーク選択、設定保存、カード選択、Escape、閉じる、戻る・進む、URL直開きに対応する。プロジェクト直リンクは`/?project=scrum-workbench#projects`。独自記事の本文は既存の`/articles/<id>`を維持する。

記事例は公開サイトで確認したタイトルとURLを使用。プロジェクト説明は提供仕様と確認済みの開発資料に基づき、未確認の役割・技術・公開日・LPは加えていない。Projectsは既存ロゴ・ユーザー提供のダッシュボードSVG・開発中イメージの抜粋を使用する。画像は一覧カードだけに表示し、詳細モーダルでは再掲しない。画像面と名前・概要をそろえたカードとする。

## 実装前・公開前に残る確認

- 見た目: 両テーマの色・密度・文字組みを採用するか。数値は実装可能な提案値で、既存サイトの採用済みトークンではない。
- Projects: 正式名称、公開用説明、LP、公開可能な担当範囲、画像。非公開リポジトリのURLはサイトへ掲載しない。
- 記事保存: microCMSの公開記事全件・埋め込み・画像を照合する。本実装ではCMS公開APIのtotalCount=4と4件・本文・メイン画像の保存を照合済み。
- 公開情報: 仕様書の職歴を用いる。社名公開済みの案件でも、案件説明の公開可否は最終確認する。
- 運用: 初回は手動同期、継続運用では1日1回の同期PRを推奨。PRをマージするまで新着は公開されない。

見た目のレビューと並行し、記事保存・依存更新・URL互換の基盤から着手できる粒度に分解した。詳細は[migration.md](migration.md)を参照。
