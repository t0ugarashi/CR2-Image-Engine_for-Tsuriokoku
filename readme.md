# 📸 CR2-Engine for 釣王国

![Platform](https://img.shields.io/badge/Platform-Web-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Stable-brightgreen)

**CR2-Image-Engine** は、Webメディア「おきなわ釣王国」の記事作成フローを効率化するために開発された、ブラウザ完結型の画像一括加工ツールです。  
[CR2-Image-Engine](https://t0ugarashi.github.io/CR2-Image-Engine_for-Tsuriokoku/)

---

## 📝 開発の背景
おきなわ釣王国の記事作成の現場では、iPhoneで撮影された高画質な画像（HEIC形式）や、巨大な解像度の写真が大量に扱われます。
これらを「リサイズ」「JPG変換」「リネーム」「ZIP圧縮」する手間を、現場の記者さんが**わずか1クリック**で完了できるようにすることを目的に開発されました。

---

## ✨ 主な機能
* **HEIC形式の自動変換**
    * iPhone特有のHEIC画像を、ブラウザ上で即座にJPGへ変換します。
* **2つの加工モード**
    * **アイキャッチ**: 1200x630pxにアスペクト比を維持してクロップ。
    * **本文画像**: 横幅1200pxにリサイズ（縦横比維持）。
* **インテリジェント・リネーム**
    * トグルスイッチにより「一括ナンバリング」と「元のファイル名維持」を直感的に切り替え可能です。
* **ZIP一括ダウンロード**
    * 加工後の画像を個別に保存する手間を省き、1つのZIPファイルにまとめて書き出します。
* **完全レスポンシブ対応**
    * PCでのドラッグ＆ドロップ操作はもちろん、現場でのスマホ操作にも最適化されたUIを実現しました。

---

## 🛠 技術スタック
### Frontend
* **HTML5 / CSS3** (Modern Glassmorphism Design)
* **Vanilla JavaScript** (フレームワーク非依存)

### Libraries
* [JSZip](https://stuk.github.io/jszip/): クライアントサイドでのZIP生成
* [heic2any](https://alexcorvi.github.io/heic2any/): HEICからJPGへの変換

### Deployment
* **GitHub Pages**

---

## 🚀 使い方
1.  **アクセス**: 公開URLにアクセスします。
2.  **モード選択**: 加工カテゴリ（アイキャッチ / 本文画像）を選択します。
3.  **リネーム設定**: 必要に応じてトグルをONにし、基本名と開始番号を入力します。
4.  **画像選択**: ゾーンに画像をドロップ、またはクリックしてファイルを選択します。
5.  **実行**: 「一括変換を開始してZIPダウンロード」をクリックして完了です！

---

## 🛡 プライバシー
本ツールはすべての処理をユーザーのブラウザ上で行います。画像データが外部サーバーに送信・蓄積されることは一切ありません。

---

## 📄 ライセンス
[MIT License](LICENSE) © 2026
