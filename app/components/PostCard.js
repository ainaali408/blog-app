"use client";

import { useState } from "react";
import { supabase } from '../../lib/supabase';
import CommentSection from "./CommentSection";
import { canEditPost, canDeletePost, canComment } from "@/utils/role";

export default function PostCard({ post, user, role, setPosts, name }) {
    const [editing, setEditing] = useState(false);
    const [data, setData] = useState({
        title: post.title,
        body: post.body
    });
    const canEdit = canEditPost(role, user?.id, post.author_id);
    const canDelete = canDeletePost(role, user?.id, post.author_id);
    const canAddComment = canComment(role);

    // ✅ New helper for showing author name
    const canViewAuthorName = ["Author", "Admin"].includes(role);

    const handleDelete = async () => {
        if (!confirm("Delete post?")) return;
        await supabase.from("Comments").delete().eq("post_id", post.id);
        await supabase.from("Posts").delete().eq("id", post.id);
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
    };

    const handleUpdate = async () => {
        await supabase.from("Posts").update(data).eq("id", post.id);
        setPosts((prev) =>
            prev.map((p) => (p.id === post.id ? { ...p, ...data } : p))
        );
        setEditing(false);
    };

    return (
        <div className="border p-4 rounded shadow bg-white">

            {/* ✅ Fixed here */}
            {canViewAuthorName && post.author?.name && (
                <p className="text-sm text-gray-600 mt-1">
                    By: {post.author.name}
                </p>
            )}

            {editing ? (
                <>
                    <input
                        className="border p-2 rounded w-full mb-2"
                        value={data.title}
                        onChange={(e) =>
                            setData({ ...data, title: e.target.value })
                        }
                    />
                    <textarea
                        className="border p-2 rounded w-full mb-2"
                        value={data.content}
                        onChange={(e) =>
                            setData({ ...data, content: e.target.value })
                        }
                        rows={4}
                    />
                    <button
                        onClick={handleUpdate}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-xl font-semibold">{post.title}</h2>

                    <p className="mt-1">{post.body}</p>

                    {post.summary && (
                        <div className="mt-2">
                            <h4 className="font-semibold">Summary:</h4>
                            <p>{post.summary}</p>
                        </div>
                    )}
                </>
            )}

            <div className="mt-2 space-x-2">
                {canEdit && !editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="bg-yellow-400 px-2 py-1 rounded"
                    >
                        Edit
                    </button>
                )}
                {canDelete && (
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                        Delete
                    </button>
                )}
            </div>

            {canAddComment && (
                <CommentSection postId={post.id} user={user} role={role} />
            )}
        </div>
    );
}