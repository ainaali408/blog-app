"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CommentSection({ postId, user }) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState("");

    // ✅ Fetch comments with user name (JOIN)
    const fetchComments = async () => {
        const { data, error } = await supabase
            .from("Comments")
            .select(`
                id,
                comment_text,
                user_id,
                user:users(name)
            `)
            .eq("post_id", postId);

        if (error) return console.log(error);

        setComments(data);
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    // ✅ Add comment
    const handleAdd = async () => {
        if (!text.trim()) return;

        const { data, error } = await supabase
            .from("Comments")
            .insert([
                {
                    post_id: postId,
                    user_id: user.id,
                    comment_text: text
                }
            ])
            .select(`
                id,
                comment_text,
                user:users(name)
            `)
            .single();

        if (error) return console.log(error);

        setComments((prev) => [...prev, data]);
        setText("");
    };

    return (
        <div className="mt-4">
            <h3 className="font-semibold mb-2">Comments</h3>

            {comments.length > 0 ? (
                comments.map((c) => (
                    <p key={c.id} className="text-sm bg-gray-100 p-2 rounded mb-1">
                        {/* ✅ Correct name usage */}
                        <span className="font-semibold">
                            {c.user?.name || "Anonymous"}:
                        </span>{" "}
                        {c.comment_text}
                    </p>
                ))
            ) : (
                <p className="text-gray-500 text-sm">No comments yet</p>
            )}

            {user && (
                <div className="mt-2 flex gap-2">
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a comment..."
                        className="border p-2 rounded w-full"
                    />
                    <button
                        onClick={handleAdd}
                        className="bg-blue-500 text-white px-3 rounded"
                    >
                        Post
                    </button>
                </div>
            )}
        </div>
    );
}