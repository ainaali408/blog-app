"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async () => {
        if (!email || !password || !name) {
            alert("Please enter name, email and password");
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setLoading(false);
            alert(error.message);
            return;
        }

        // Insert user into users table
        if (data?.user) {
            const { error: insertError } = await supabase.from("users").insert({
                id: data.user.id,
                name,
                email,
                role: "viewer", // default role
            });

            setLoading(false);

            if (insertError) {
                alert(insertError.message);
                return;
            }

            alert("Signup successful! Please login.");
            router.push("/login");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Sign Up
                </h1>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>

                <button
                    onClick={handleSignup}
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200 font-semibold"
                >
                    {loading ? "Signing up..." : "Sign Up"}
                </button>

                <p className="mt-4 text-center text-sm text-blue-500">
                    Already have an account? <a href="/login" className="underline">Login</a>
                </p>
            </div>
        </div>
    );
}