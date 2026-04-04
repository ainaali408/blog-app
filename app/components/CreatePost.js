"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { canCreatePost } from "@/utils/role";
import { useRouter } from "next/navigation"; // 🔹 for redirect

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState("");

    const router = useRouter(); // 🔹 hook for navigation

    useEffect(() => {
        const getUser = async () => {
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session) return;

            const currentUser = sessionData.session.user;
            setUser(currentUser);

            const { data: roleData } = await supabase
                .from("users")
                .select("role")
                .eq("id", currentUser.id)
                .maybeSingle();

            if (roleData) {
                setRole(roleData.role);
            }
        };

        getUser();
    }, []);

    // 🤖 AI Summary Generator
    const generateSummary = async () => {
        if (!body) {
            alert("Write content first");
            return;
        }

        setLoading(true);
        const res = await fetch("/api/ai-summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: body }),
        });

        if (!res.ok) {
            console.log("API FAILED");
            setLoading(false);
            return;
        }

        const data = await res.json();
        setSummary(data.summary);
        setLoading(false);
    };

    // 🔥 Submit Function
    const handleSubmit = async () => {
        if (!canCreatePost(role)) {
            alert("Access denied");
            return;
        }

        if (!user) {
            alert("User not loaded");
            return;
        }

        const { error } = await supabase.from("Posts").insert([
            {
                title,
                body,
                image_url: imageUrl,
                summary,
                author_id: user.id,
            },
        ]);

        if (error) {
            alert("Error creating post");
            console.log(error);
        } else {
            alert("Post created successfully");
            // 🔹 Redirect back to dashboard after successful post
            router.push("/dashboard");
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "auto", padding: 20 }}>
            <h1 className="text-2xl font-bold mb-4">Create Post</h1>

            <input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 w-full rounded mb-4"
            />

            <textarea
                placeholder="Body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="border p-2 w-full rounded mb-4"
            />

            <input
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="border p-2 w-full rounded mb-4"
            />

            <button
                onClick={generateSummary}
                disabled={loading}
                className="bg-yellow-500 text-white px-4 py-2 rounded mb-4"
            >
                {loading ? "Generating..." : "Generate AI Summary"}
            </button>

            <textarea
                placeholder="AI Summary will appear here"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="border p-2 w-full rounded mb-4"
            />

            {canCreatePost(role) && (
                <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                >
                    Create Post
                </button>
            )}

            {/* 🔹 Back Button */}
            <button
                onClick={() => router.push("/dashboard")}
                className="bg-gray-500 text-white px-4 py-2 rounded"
            >
                Back
            </button>
        </div>
    );
}