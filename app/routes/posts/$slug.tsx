import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

interface IParams {
  params: { slug: string };
}

export const loader = async ({ params: { slug } }: IParams) => {
  return json({ slug });
};

export default function PostSlug() {
  const { slug } = useLoaderData();
  return (
    <main className="mx-auto max-w-4xl">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        Some Post: {slug}
      </h1>
    </main>
  );
}
