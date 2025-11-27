import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { taskRepository } from "@/lib/repositories/TaskRepository";
import { format } from "date-fns";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const allTasks = await taskRepository.getTasks();
    const tasks = allTasks
        .filter(t => t.assigneeId === session.user.id && t.status !== "DONE")
        .sort((a, b) => (b.id > a.id ? 1 : -1)) // Approximate sort by creation (using ID or we need createdAt)
        .slice(0, 5);

    // We need to map meeting to null as it's not supported
    const tasksWithMeeting = tasks.map(t => ({ ...t, meeting: null }));

    // Meetings not supported yet
    const meetings: any[] = [];

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
                            {tasksWithMeeting.map((task: any) => (
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
