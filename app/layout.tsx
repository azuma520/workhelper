export const metadata = { title: "SOP App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-dvh bg-white text-gray-900">{children}</body>
    </html>
  );
}
