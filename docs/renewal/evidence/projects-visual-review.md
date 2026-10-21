# Projectsの画像表示確認

2026-10-21 / v0.9

## 方針と素材

ユーザー指定の「実画面やロゴで、制作物を見せたい」を反映。PC4カラムを維持し、画像面・名前・短い概要の順にした。画像面の色は両テーマで共通、本文と枠はテーマへ追従する。

| Project | 使用素材 | 確認元 |
| --- | --- | --- |
| ScrumWorkbench | 横組みの既存ロゴ | `/Users/koukibuu3/Repos/koukibuu3/scrum-workbench/packages/ui/assets/brand/logos/logo-horizontal.svg`。ブランドREADMEの明るい背面・既存素材を変更しない方針に従う |
| Salestack | 紹介用の売上一覧画面 | `/Users/koukibuu3/Repos/koukibuu3/salestack/apps/web/public/pc-sample.png` |
| Core Uma | 既存ロゴ | `/Users/koukibuu3/Repos/koukibuu3/core-uma/apps/web/public/core-uma-logo-light.png` |
| G.G. Garage | プロジェクト名の文字表現 | 使用可能な画像を確認できていない。GitHub組織のアバターは既定のidenticonのため採用しない。公式ロゴとは扱わない |

採用した3素材のみ`prototype/assets/projects/`へコピー。画像データの加工、架空の画面やロゴの生成は行っていない。

## 確認

- JavaScript構文チェック: `node --check docs/renewal/prototype/prototype.js` 成功。
- Chromeの一時viewportで1440px・1024pxは4列、768pxは2列、390pxは1列を確認。全幅でページの横はみ出しなし。
- 画像3点の読み込み成功。1440pxのカード幅は全件265px、高さは全件約288px。
- 1024px・768px・390pxで全件のタイトルが1行、画像面の高さが各幅で一致することを確認。
- ライト／ダークの画像・本文表示を確認。
- Salestackの詳細で紹介用画面が読み込まれ、Escapeで閉じることを確認。
- 続いてG.G. Garageを開いた際は前の画像が残らず、画像領域が隠れることを確認。閉じる操作も確認。
- 画像読み込み失敗時はカード名の文字表現へ戻し、詳細の画像が失敗した場合は画像領域だけを隠す処理を追加。障害注入による実動確認は未実施。
- アプリ内ブラウザのプレビューも再読み込みして画像表示を確認。

[PC・ライト](projects-visual-light-1440.jpg) / [PC・ダーク](projects-visual-dark-1440.jpg) / [モバイル・ダーク](projects-visual-dark-390.jpg)

確認対象はローカルのデザインモック。本番アプリの実装・デプロイは含まない。
