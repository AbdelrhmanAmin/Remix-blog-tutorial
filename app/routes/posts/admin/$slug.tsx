import {
  useLoaderData,
  useActionData,
  Form,
  useTransition,
} from "@remix-run/react";
import { getPost, updatePost, deletePost } from "~/models/post.server";
import { redirect, json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { ActionData } from "./index";

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, `params.slug is required`);
  const post = await getPost(params.slug);
  invariant(post, `post not found: ${params.slug}`);
  return json({ post });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const formTypeUpdate = formData.get("update");
  const formTypeDelete = formData.get("delete");

  const [title, slug, markdown] = [
    formData.get("title"),
    formData.get("slug"),
    formData.get("markdown"),
  ];
  if (formTypeUpdate !== null) {
    // validation...
    const errors: ActionData = {
      title: formData.get("title") ? null : "Title is required",
      slug: formData.get("slug") ? null : "Slug is required",
      markdown: formData.get("markdown") ? null : "Markdown is required",
    };
    const hasError = Object.values(errors).some((errorMessage) => errorMessage);
    if (hasError) {
      return json(errors);
    }
    // update post...
    invariant(typeof title === "string", "title is required");
    invariant(typeof slug === "string", "slug is required");
    invariant(typeof markdown === "string", "markdown is required");

    await updatePost({ title, slug, markdown });
  }
  if (formTypeDelete !== null) {
    invariant(typeof slug === "string", "slug is required");
    await deletePost(slug);
  }

  return redirect("/posts/admin");
};

const stackClassName = "flex flex-col w-full";
const fieldClassName = `${stackClassName} bg-gray-100 border border-gray-200 rounded-lg my-4 p-2 pb-4 font-medium capitalize overflow-hidden`;
const inputClassName =
  "w-full rounded border border-gray-500 px-2 py-1 text-lg";
export default () => {
  const {
    post: { title, slug, markdown },
  } = useLoaderData();
  const errors = useActionData();
  const transition = useTransition();
  const isUpdating = Boolean(transition.submission);
  return (
    <Form method="post">
      <h1 className="text-3xl font-semibold">Edit Post</h1>
      <div className={stackClassName}>
        <div className={fieldClassName}>
          <label htmlFor="title">
            title:{" "}
            {errors?.title && <em className="text-red-600">{errors.title}</em>}
          </label>

          <input
            type="text"
            id="title"
            name="title"
            defaultValue={title}
            className={inputClassName}
          />
        </div>
        <div className={fieldClassName}>
          <label htmlFor="slug">
            slug:{" "}
            {errors?.slug && <em className="text-red-600">{errors.slug}</em>}
          </label>

          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={slug}
            className={inputClassName}
          />
        </div>
        <div className={fieldClassName}>
          <label htmlFor="markdown">
            Markdown:{" "}
            {errors?.markdown && (
              <em className="text-red-600">{errors.markdown}</em>
            )}
          </label>

          <textarea
            name="markdown"
            id="markdown"
            defaultValue={markdown}
            className={inputClassName}
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            name="delete"
            disabled={isUpdating}
            className="rounded-md bg-red-600 py-4 px-8 font-medium text-white transition duration-300 hover:bg-red-700 active:scale-95 disabled:bg-stone-800"
          >
            Delete
          </button>
          <button
            type="submit"
            name="update"
            disabled={isUpdating}
            className="w-36 rounded-md bg-orange-500 py-4 px-8 font-medium text-white transition duration-300 hover:bg-orange-600 active:scale-95 disabled:bg-stone-800"
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </Form>
  );
};
