# Projectsの素材差し替え

2026-10-21 / v0.10

## 素材

- Salestack: ユーザー提供の`/Users/koukibuu3/Downloads/hero-dashboard.svg`を`prototype/assets/projects/salestack.svg`へそのままコピー。紹介用の旧PNGは配信ディレクトリから除去した。実画面ではなくダッシュボードのイメージとする。
- G.G. Garage: ユーザー提供の`/Users/koukibuu3/Downloads/ed31d7da-550e-4110-af85-12aba50ded59.png`から、左332px・上340px、幅448px・高さ280pxの領域を切り出した。元画像は変更せず、配信ディレクトリには`gg-garage-detail.png`だけを保存する。HUD、マップ、場面全体を含めない。
- imagegenによる切り出しを試したが細部が変わったため不採用。採用画像はmacOSのsipsで画素を切り出したもの。生成結果はサイトから参照しない。
- 読み取り専用のPillowによる全125,440画素の比較で、抜粋が元画像の指定範囲と完全一致することを確認。SVGのバイト一致も確認。

## 表示確認

- Chromeの1440pxで4カラムと両テーマを確認。390pxで1カラム、横はみ出しなし。
- G.G. Garageの詳細が`gg-garage-detail.png`（448×280）のみを表示することを確認。元画像は配信ディレクトリへコピーしていない。
- Salestackのカード・詳細でSVGの読み込み成功と、詳細画像の説明が「ダッシュボードのイメージ」であることを確認。
- アプリ内ブラウザも更新し、差し替えた4素材が読み込まれることを確認。
- JavaScript構文チェック成功。

[PC・ダーク](project-assets-dark-1440.jpg) / [PC・ライト](project-assets-light-1440.jpg) / [G.G. Garageの詳細](gg-garage-excerpt-dialog.jpg)
