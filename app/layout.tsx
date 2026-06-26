import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "千葉県サーフィン連盟 | CHIBA SURFING FEDERATION",
  description:
    "サーフィン競技、地域、環境、次世代をつなぐ千葉県サーフィン連盟の公式サイト・コンセプトLP。",
  openGraph: {
    title: "千葉県サーフィン連盟",
    description: "海から、千葉の未来を動かす。",
    type: "website",
    locale: "ja_JP",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
