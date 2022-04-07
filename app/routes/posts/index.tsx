import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/models/post.server";

type Post = {
  slug: string;
  title: string;
};

type LoaderData = {
  posts: Awaited<Post[]>;
};

export const loader = async () => {
  return json({
    posts: await getPosts(),
  });
};

export default function Posts() {
  const { posts } = useLoaderData() as LoaderData;
  console.log(posts);
  return (
    <main>
      <h1>Posts</h1>
      <ul>
        {posts.map((post: Post) => (
          <li key={post.slug}>
            <Link to={post.slug} className="text-blue-600 underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
