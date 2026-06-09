import { notFound } from "next/navigation";
import { getContentBySlug, listContents } from "@/lib/db";
import { MarkdownPreview } from "@/app/MarkdownPreview";
import { GiscusComments } from "../GiscusComments";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return listContents({ visibility: "public", type: "post" }).map((item) => ({
      slug: item.slug,
    }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getContentBySlug(slug);

  if (!post || post.visibility !== "public" || post.type !== "post") {
    notFound();
  }

  return (
    <article className="page">
      <p className="eyebrow">公开文章</p>
      <h1>{post.title}</h1>
      <p className="lead">{post.summary}</p>

      <div className="tag-row">
        <span className="tag">{post.category}</span>
        {post.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      {post.coverAsset ? (
        <section className="section article-cover">
          <img src={`/assets/${post.coverAsset.id}`} alt={post.coverAsset.alt || post.title} />
        </section>
      ) : null}

      <section className="section panel article-body">
        <MarkdownPreview content={post.body} />
      </section>

      <GiscusComments term={post.slug} />
    </article>
  );
}
