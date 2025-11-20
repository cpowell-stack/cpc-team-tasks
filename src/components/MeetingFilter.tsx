"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function MeetingFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentFilter = searchParams.get("filter") || "upcoming";

    const filters = [
        { id: "upcoming", label: "Upcoming" },
        { id: "past_week", label: "Past Week" },
        { id: "past_month", label: "Past Month" },
        { id: "all", label: "All Time" },
    ];

    const handleFilterChange = (filterId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("filter", filterId);
        router.push(`/meetings?${params.toString()}`);
    };

    return (
        <div className="flex space-x-2 mb-4">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => handleFilterChange(filter.id)}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${currentFilter === filter.id
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}
