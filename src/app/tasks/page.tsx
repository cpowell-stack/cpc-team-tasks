import { taskRepository } from '@/lib/repositories/TaskRepository';
import { userRepository } from '@/lib/repositories/UserRepository';
import TasksTable from './TasksTable';

export default async function TasksPage() {
    const tasks = await taskRepository.getTasks();
    // Populate assignee if needed, or pass as is if Table handles it.
    // The Table likely expects assignee object.
    const users = await userRepository.getAllUsers();
    const userMap = new Map(users.map(u => [u.id, u]));

    const tasksWithAssignee = tasks.map(t => ({
        ...t,
        assignee: t.assigneeId ? userMap.get(t.assigneeId) : null
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Tasks</h1>
            <TasksTable initialTasks={tasksWithAssignee} />
        </div>
    );
}
