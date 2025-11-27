import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { userRepository } from "@/lib/repositories/UserRepository";
import { TaskForm } from "@/components/TaskForm";

export default async function NewTaskPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const users = await userRepository.getAllUsers();
    // Sort by name
    users.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Task</h1>
            <TaskForm users={users} />
        </div>
    );
}
