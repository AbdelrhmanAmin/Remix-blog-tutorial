import { Link } from "@remix-run/react";

export type ActionData =
  | {
      title: null | string;
      slug: null | string;
      markdown: null | string;
    }
  | undefined;

export default function AdminIndex() {
  return (
    <p>
      <Link to="new" className="text-blue-600 underline">
        Create a New Post
      </Link>
    </p>
  );
}
