import { notFound } from "next/navigation";
import { getPostData, getAllPosts } from "@/lib/getPostData";
import PostLayout from "@/components/PostLayout";
import PostArticle from "@/components/PostArticle";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  
  return posts.map((post) => ({
    slug: [post.slug],
  }));
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
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