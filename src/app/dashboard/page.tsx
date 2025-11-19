import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const tasks = await prisma.task.findMany({
        where: {
            assigneeId: session.user.id,
            status: {
                not: "DONE",
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 5,
        include: {
            meeting: true,
        },
    });

    const meetings = await prisma.meeting.findMany({
        where: {
            date: {
                gte: new Date(),
            },
        },
        orderBy: {
            date: "asc",
        },
        take: 5,
        include: {
            organizer: true,
        },
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Tasks */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">My Pending Tasks</h2>
                    {tasks.length === 0 ? (
                        <p className="text-gray-500">No pending tasks.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {tasks.map((task: any) => (
                                <li key={task.id} className="py-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{task.title}</p>
                                            <p className="text-sm text-gray-500">{task.description}</p>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            {task.status}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Upcoming Meetings */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Upcoming Meetings</h2>
                    {meetings.length === 0 ? (
                        <p className="text-gray-500">No upcoming meetings.</p>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {meetings.map((meeting: any) => (
                                <li key={meeting.id} className="py-4">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {format(new Date(meeting.date), "PPP p")}
                                            </p>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            by {meeting.organizer.name}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
