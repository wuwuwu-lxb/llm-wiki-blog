import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "llm-selfwiki",
  description: "个人动态博客、知识库和 self-LLM AI 分身",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="zh-CN">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">
            llm-selfwiki
          </Link>
          <nav className="top-nav" aria-label="主导航">
            <Link href="/self">self-LLM</Link>
            <Link href="/blog">博客</Link>
            <Link href="/dashboard">工作台</Link>
            <Link href="/dashboard/taxonomy">分类</Link>
            {user ? (
              <form action="/api/auth/logout" method="post">
                <button className="nav-button" type="submit">
                  退出 @{user.login}
                </button>
              </form>
            ) : (
              <Link href="/login">登录</Link>
            )}
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
