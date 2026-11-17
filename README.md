# deadsea-games

Dead Sea Games（株式会社ファンクション・ティ ゲーム部門）のホームページ。https://deadsea-games.com/

素の HTML と CSS（と小さな JS）だけのページで、ビルドは無い。GitHub Pages の main ブランチ直下から公開する（`CNAME` に独自ドメイン）。

| ページ | ファイル |
|---|---|
| トップ（作品・お知らせ・スタジオ） | `index.html` |
| 作品紹介「百の迷宮と 魂の王」（物語・特徴・魂と魔物・ギャラリー・発売・製品情報・よくある質問） | `soulking/index.html` |
| お問い合わせ（Supabase の関数 `contact` へ送る） | `contact/index.html`・`contact/contact.js` |
| 見つからないページ | `404.html` |

- 見た目は全ページ共通の `style.css`。段が画面に入った時の浮かび上がりは `site.js`（動きを減らす設定では動かさない）。
- 作品の絵は `assets/soulking/`。ゲームのリポジトリ（KotaroTao/DOS）の `art/` から WebP に圧縮して写したもの。後の章の秘密に触れる絵（後半の章の物語の絵・主の絵）は載せない。
- トレイラー (1分30秒) は `assets/soulking/trailer-90s.mp4` (最初の絵 `trailer-90s-poster.webp`)。ゲームの絵・実際のプレイ画面の録画・30秒CMの一部・BGM「オルド最後の戦い」から ffmpeg で組み立てた。予告編の欄で「トレイラー / CM」を切り替える (`site.js` の `REELS`)。
- 予告編の動画は `assets/soulking/trailer.mp4` (横型) と `trailer-vertical.mp4` (縦型。縦に持ったスマホで切り替える)。元の動画を ffmpeg で圧縮し (H.264・crf 23・上限 3.5Mbps・faststart)、最初の絵 `trailer-poster*.webp` は動画の一場面から作る。押すまで読み込まない (`preload="none"`)。
- お知らせは `index.html` の `#news` に新しい順で足す。ストアのページができたら、`soulking/index.html` の「ストアページ 準備中」をリンクに替える。
- 手元で見る: `python3 -m http.server 8100` → http://localhost:8100/（ページ内のリンクはルートからの絶対パスなので、`file://` では崩れる）。

ゲーム本体は別のリポジトリ（KotaroTao/DOS）。テストプレイ版を https://soulking.deadsea-games.com/ に置いている（発売時に閉じる予定）。
