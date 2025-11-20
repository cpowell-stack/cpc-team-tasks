"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function SyncButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSync = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/meetings/sync", { method: "POST" });
            if (res.ok) {
                router.refresh();
            } else {
                console.error("Sync failed");
                alert("Failed to sync. Make sure you are logged in with Google.");
            }
        } catch (error) {
            console.error("Sync error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
        >
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Syncing..." : "Sync Calendar"}
        </button>
    );
}
