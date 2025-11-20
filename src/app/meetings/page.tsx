import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { SyncButton } from "@/components/SyncButton";

export const dynamic = 'force-dynamic';


export default async function MeetingsPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const meetings = await prisma.meeting.findMany({
        include: {
            organizer: true,
        },
        orderBy: {
            date: "asc",
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
                <div className="flex items-center">
                    <SyncButton />
                    <Link
                        href="/meetings/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Schedule Meeting
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {meetings.map((meeting: any) => (
                        <li key={meeting.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                        <p className="text-sm font-medium text-blue-600 truncate">
                                            {meeting.title}
                                        </p>
                                    </div>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {format(new Date(meeting.date), "PPP p")}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            Organized by {meeting.organizer.name}
                                        </p>
                                    </div>
                                    {meeting.googleEventId && (
                                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                            <span className="text-green-600 flex items-center">
                                                Synced with Google Calendar
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
