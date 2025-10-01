import "./globals.css";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

export const metadata = { 
  title: "效率菁英 - 行動驅動的 SOP 系統",
  description: "讓記錄變得自然而然，打造您的高效工作流程"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-gray-50">
        <Sidebar />
        <TopBar />
        <div className="pl-64 pt-16">
          {children}
        </div>
      </body>
    </html>
  );
}
