import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';



export default async function TasksPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const tasks = await prisma.task.findMany({
        include: {
            assignee: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                <Link
                    href="/tasks/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Task
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {tasks.map((task: any) => (
                        <li key={task.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-blue-600 truncate">
                                        {task.title}
                                    </p>
                                    <div className="ml-2 flex-shrink-0 flex">
                                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {task.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 sm:flex sm:justify-between">
                                    <div className="sm:flex">
                                        <p className="flex items-center text-sm text-gray-500">
                                            {task.description}
                                        </p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                        <p>
                                            Assigned to: {task.assignee?.name || "Unassigned"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
