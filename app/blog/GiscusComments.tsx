"use client";

import Script from "next/script";

type GiscusCommentsProps = {
  term: string;
};

export function GiscusComments({ term }: GiscusCommentsProps) {
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  if (!repo || !repoId || !category || !categoryId) {
    return (
      <section className="section panel">
        <h2>评论</h2>
        <p className="muted">giscus 还没有配置。配置 GitHub Discussions 后，这里会显示评论区。</p>
      </section>
    );
  }

  return (
    <section className="section panel">
      <h2>评论</h2>
      <div className="giscus-host" />
      <Script
        src="https://giscus.app/client.js"
        data-repo={repo}
        data-repo-id={repoId}
        data-category={category}
        data-category-id={categoryId}
        data-mapping="specific"
        data-term={term}
        data-strict="1"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="light"
        data-lang="zh-CN"
        data-loading="lazy"
        crossOrigin="anonymous"
        async
      />
    </section>
  );
}

