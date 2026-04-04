"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "../components/PostCard";
import { canCreatePost } from "@/utils/role";
import { useRouter } from "next/navigation"; // 🔹 for redirect

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const router = useRouter(); // 🔹 hook for redirect

  // Fetch posts

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("Posts")
        .select(`
        id,
        title,
        body,
        summary,
        image_url,
        author_id,
        author:users(id, name)
      `);

      if (error) {
        console.log(error);
        return;
      }

      setPosts(data || []);
    };

    fetchPosts();
  }, []);

  // Fetch user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      const currentUser = data.session.user;
      setUser(currentUser);

      const { data: roleData, error } = await supabase
        .from("users")
        .select("role, name")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (error) console.log(error);

      if (roleData) {
        setRole(roleData.role || "Viewer");
        setName(roleData.name || "User");
      }
    };
    getUser();
  }, []);

  // 🔹 Redirect to create post page
  const handleCreatePostRedirect = () => {
    router.push("/create-post"); // make sure this page exists
  };

  return (
    <div className="p-6">
      {user && (
        <div className="bg-white shadow-md p-4 rounded-lg mb-6">
          <p>
            Welcome <span className="text-blue-600">{name}</span>
          </p>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm mt-1">
            Role: <span className="font-semibold">{role}</span>
          </p>
        </div>
      )}

      {/* 🔹 Create Post Button for Admin & Author */}
      {canCreatePost(role) && (
        <button
          onClick={handleCreatePostRedirect}
          className="bg-green-500 text-white px-4 py-2 rounded mb-6 hover:bg-green-600"
        >
          Create Post
        </button>
      )}

      {/* POSTS */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            user={user}
            role={role}
            setPosts={setPosts}
            name={name}


          />
        ))}
      </div>
    </div>
  );
}