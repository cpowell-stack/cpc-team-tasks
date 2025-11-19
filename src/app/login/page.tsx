"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Team Task Manager</h1>
            <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Sign in with Google
            </button>
        </div>
    );
}
