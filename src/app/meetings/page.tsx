import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { format, subDays } from "date-fns";
import { SyncButton } from "@/components/SyncButton";
import { MeetingFilter } from "@/components/MeetingFilter";

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function MeetingsPage(props: {
    searchParams: SearchParams
}) {
    const searchParams = await props.searchParams
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const filter = (typeof searchParams.filter === 'string' ? searchParams.filter : "upcoming");
    const now = new Date();
    let dateFilter: any = {};

    switch (filter) {
        case "upcoming":
            dateFilter = {
                gte: now,
            };
            break;
        case "past_week":
            dateFilter = {
                gte: subDays(now, 7),
                lt: now,
            };
            break;
        case "past_month":
            dateFilter = {
                gte: subDays(now, 30),
                lt: now,
            };
            break;
        case "all":
            dateFilter = undefined;
            break;
        default:
            dateFilter = {
                gte: now,
            };
    }

    const meetings = await prisma.meeting.findMany({
        where: {
            date: dateFilter,
        },
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

            <MeetingFilter />

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {meetings.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        No meetings found for this period.
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
}
