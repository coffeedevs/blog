import { notFound } from "next/navigation";
import { getPostData, getAllPosts, getAllTags, getPostsByTag } from "@/lib/getPostData";
import PostLayout from "@/components/PostLayout";
import PostArticle from "@/components/PostArticle";
import TagPage from "@/components/TagPage";

export async function generateStaticParams() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  const postParams = posts.map((post) => ({
    slug: [post.slug],
  }));

  const tagParams = tags.map((tag) => ({
    slug: ["tag", tag.slug],
  }));

  return [...postParams, ...tagParams];
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;

  // Handle /tag/{slug} routes
  if (params.slug[0] === "tag" && params.slug.length === 2) {
    const tagSlug = params.slug[1];
    const tags = await getAllTags();
    const tag = tags.find((t) => t.slug === tagSlug);

    if (!tag) {
      notFound();
    }

    const posts = await getPostsByTag(tagSlug);
    return <TagPage tagName={tag.name} posts={posts} />;
  }

  const postData = await getPostData(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <PostLayout title={postData.title} featureImage={postData.featureImage} slug={postData.slug}>
      <PostArticle
        articleMdx={postData.articleMdx}
        title={postData.title}
        slug={postData.slug}
        author={postData.author}
      />
    </PostLayout>
  );
}