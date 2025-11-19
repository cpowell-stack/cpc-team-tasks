"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function MeetingForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const dateTime = new Date(`${date}T${time}`);

        try {
            const res = await fetch("/api/meetings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    date: dateTime.toISOString(),
                }),
            });

            if (res.ok) {
                router.push("/meetings");
                router.refresh();
            } else {
                console.error("Failed to create meeting");
            }
        } catch (error) {
            console.error("Error creating meeting:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <div className="mt-1">
                        <input
                            type="date"
                            name="date"
                            id="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Time
                    </label>
                    <div className="mt-1">
                        <input
                            type="time"
                            name="time"
                            id="time"
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? "Scheduling..." : "Schedule Meeting"}
                </button>
            </div>
        </form>
    );
}
