// src/pages/BlogDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";

/**
 * BlogDetail expects a `posts` prop (array). For demo we will pass `allPosts` from App.
 */

export default function BlogDetail({ posts = [] }) {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Post not found</h2>
          <Link to="/" className="text-blue-500 underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-sm text-blue-400 underline mb-4 inline-block"
        >
          ← Back
        </Link>
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="text-xs text-slate-400 mb-6">
          Published: {post.date}
        </div>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="rounded mb-6 w-full object-cover"
          />
        )}

        <article
          className="prose max-w-none text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </main>
  );
}
