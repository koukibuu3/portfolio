本体実装の確認は[確定デザインの実装確認](implementation-review.md)を参照。以下は設計モックの履歴。

# 設計資料・モックの確認記録

最新のv0.11の確認は[詳細モーダルの画像削除](project-dialog-no-image-review.md)を参照。v0.10の確認は[Projectsの素材差し替え](project-assets-review.md)を参照。v0.9の確認は[Projectsの画像表示確認](projects-visual-review.md)を参照。v0.8の確認は[Core Umaの説明訂正](core-uma-content-review.md)を参照。v0.7の確認は[Focus原文復元の確認](focus-original-review.md)を参照。v0.6の確認は[Focusの補足確認](focus-review.md)を参照。v0.5の確認は[4カラムと削除指定の確認](columns-and-copy-review.md)を参照。v0.4は[コピー調整の確認](copy-review.md)、以下はv0.3時点のブラウザ検証と保存画像。

実施日: 2026-10-21 / 設計v0.3（1ページ型・両テーマ・カードとタイムライン）

## 確認したこと

提供仕様書v1.0を保存し、追加指示を[変更仕様](../requirements-update.md)として反映した。原本は変更していない。前段の現状調査で読み取った独自記事4件、外部プロフィール、Vercel配信、旧`.net`参照は[移行計画](../migration.md)に記録している。今回の再確認対象は更新した設計と操作モック。

`prototype.js`の構文を`node --check`で確認し、ローカルHTTP配信をPlaywright Chromiumで検証した。[browser-checks.json](browser-checks.json)の119項目のassertionが成功し、ブラウザJavaScriptエラーは0件だった。

## ブラウザ確認の範囲

| 条件 | 結果 |
| --- | --- |
| ライト／ダーク × 320 / 390 / 768 / 1440px | 両テーマ・全幅でH1が1つ、制作物4件が同じページに表示 |
| 上記8条件 × Home / Projects / Writing / Aboutのクリック | 全32条件で横はみ出しなし、対象が追従Headerに隠れず、現在地の下線が同期 |
| 各Projectの面・角丸・内余白 | 全8条件で背景面と全周枠、12px以上の角丸、24px以上の内余白を確認 |
| 隣接セクションの背景 | 全8条件で異なる背景面になっていることを確認 |
| Recent Activity | 全8条件でol、2pxの軸、円形の点によるタイムラインを確認 |
| 太陽・月のテーマ選択 | 全8条件で2つの名前付きSVGアイコン、44px以上の操作領域、選択状態が1つであることを確認 |
| アンカー直開き・戻る・進む | 対象セクションとhashが同期 |
| 手動スクロール | ナビの現在地が追従し、URLを変更しない |
| 通常の動作設定 | smoothスクロールでAboutまで移動 |
| 動きを抑える設定 | 即時スクロールで各アンカーへ移動 |
| 初回OSテーマ | ライト・ダークの双方に追従 |
| 手動テーマ切替・reload | 選択を保存して再現、OS設定より選択を優先 |
| 手動選択前のOS変更 | テーマがOSに追従 |
| localStorageが例外になる環境 | ページ内のテーマ切替が機能 |
| Projectsカード→モーダル→Escape | 同じページを背景に開き、元カードの位置・フォーカスへ復帰 |
| モーダルの戻る・進む | 開閉がURLと同期 |
| 全4件のquery直開き・reload後に閉じる | 同じページのProjectsに残り、project queryを除去 |
| 未知slug・重複project指定 | モーダルを開かず正規化。他のqueryは保持 |
| Tab / Shift+Tab | ダイアログ内の操作へフォーカスを保持 |
| 390×844pxのダイアログ | 全画面で表示 |
| Writingの過去記事 | 同じページで6件から8件へ展開 |
| JS無効 | 全セクションと4件のカード、アンカー移動、過去記事の展開、Projectの代替詳細が利用可能 |
| JS無効＋OSダーク | CSSでダーク背景を適用 |

全幅の背景面でセクションを区分し、Projectsは面を持つカード、Recent Activityは縦タイムラインへ変更した。テーマは右上の太陽・月から明示的に選択する。追加でアプリ内ブラウザでも、太陽でライトになること、同じ太陽を再クリックしても反転しないこと、月をSpaceキーで選んでダークになることを確認した。開いているタブを再読み込みし、更新したProjectsを表示した。

## 色の計算

WCAGの相対輝度式で計算した比率。本文・補助文字・リンクの全組み合わせと主操作上の文字は4.5:1以上。

| 組み合わせ | ライト | ダーク |
| --- | --- | --- |
| ink/canvas | 13.85:1 | 15.52:1 |
| muted/canvas | 5.25:1 | 8.75:1 |
| accent/canvas | 6.84:1 | 10.24:1 |
| ink/surface | 14.77:1 | 13.80:1 |
| muted/surface | 5.60:1 | 7.78:1 |
| accent/surface | 7.29:1 | 9.10:1 |
| ink/card | 14.77:1 | 11.73:1 |
| muted/card | 5.60:1 | 6.61:1 |
| accent/card | 7.29:1 | 7.73:1 |
| ink/soft | 13.03:1 | 13.02:1 |
| muted/soft | 4.94:1 | 7.34:1 |
| accent/soft | 6.43:1 | 8.59:1 |
| on/accent | 7.29:1 | 9.57:1 |

これは全画面のアクセシビリティ適合判定ではない。淡い装飾罫線を操作識別の唯一の手掛かりにしない設計とした。

## スクリーンショット

いずれも1ページの各セクションへ移動した後のviewport画像。別ページではない。

| 対象 | ライト | ダーク |
| --- | --- | --- |
| Home PC | [1440px](home-light-1440.png) | [1440px](home-dark-1440.png) |
| Home mobile | [390px](home-light-390.png) | [390px](home-dark-390.png) |
| Projects PC | [1440px](projects-light-1440.png) | [1440px](projects-dark-1440.png) |
| Projects mobile | [390px](projects-light-390.png) | [390px](projects-dark-390.png) |
| Recent Activity PC | [1440px](activity-light-1440.png) | [1440px](activity-dark-1440.png) |
| Recent Activity mobile | [390px](activity-light-390.png) | [390px](activity-dark-390.png) |
| About PC | [1440px](about-light-1440.png) | [1440px](about-dark-1440.png) |
| About mobile | [390px](about-light-390.png) | [390px](about-dark-390.png) |
| Dialog | — | [1440px](dialog-dark-1440.png) / [390px](dialog-dark-390.png) |

ProjectsのライトPCとRecent ActivityのダークPC・ライトモバイルを視覚的にも確認した。画像はモックのレンダリングで、サイト本体を実装・公開した証拠ではない。

## 未実施・実装時に残るもの

- Next本体の依存更新、production build、CI、公開。
- microCMSの全件・本文・画像保存、外部記事同期と障害時のsnapshot保持。
- 本番実装でのJS実行失敗時の代替詳細、旧hash・旧一覧redirect、RSS/API。
- テーマ選択の別タブ同期はモックに実装済みだが、今回は専用シナリオ未検証。
- 画像・長文・複数リンク入りモーダル、内部ドラッグ後に背景へ解放する操作。
- VoiceOver、文字だけ200%拡大、400%ズーム、Safari / Firefox、実スマートフォンのsafe-area・タッチ操作。
- 本番SEO・OGP・性能・Vercel設定・旧ドメインの配信。

公開前の検証計画は[移行計画](../migration.md)を参照。
