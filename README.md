# 千葉県サーフィン連盟 コンセプトLP

Next.js + TypeScript + GSAP + Lenis + Framer Motion + Three.js で構築した、Vercel公開用のリッチLPです。

## 実装内容

- Three.jsによるリアルタイム波面ビジュアル
- GSAP ScrollTriggerによるスクロール演出
- Lenisによるスムーズスクロール
- PC / タブレット / スマホ対応
- 大会、活動、選手、FAQ、問い合わせセクション
- prefers-reduced-motion対応
- Vercel Serverless Function形式の問い合わせAPI

## ローカル起動

```bash
npm install
npm run dev
```

http://localhost:3000 を開きます。

## Vercel公開

1. このフォルダをGitHubへpush
2. VercelでリポジトリをImport
3. Framework PresetはNext.js
4. `CONTACT_WEBHOOK_URL` をEnvironment Variablesへ登録
5. Deploy

## 問い合わせフォーム

`CONTACT_WEBHOOK_URL` に、以下のJSONをPOSTします。

```json
{
  "name": "...",
  "email": "...",
  "subject": "...",
  "message": "...",
  "source": "chiba-surfing-federation-lp"
}
```

Make、Zapier、Slack Workflow、独自APIなどを接続できます。未設定時は送信せず、画面に設定エラーを表示します。

## 公開前に必ず差し替える項目

- 実在選手の氏名・写真・戦績（本人許諾と写真利用権を確認）
- 確定済み大会日程、会場、エントリーURL
- 連盟の正式ロゴ、役員、規約、所在地、問い合わせ先
- Instagram等の公式SNS URL
- プライバシーポリシー
- OGP画像とfavicon

## 画像方針

初版は著作権事故を避けるため、WebGLとCSSで生成した独自ビジュアルを使用しています。実在選手をAI生成画像で代替すると誤認リスクがあるため、選手欄は許諾済み公式写真への差し替えを前提にしています。
