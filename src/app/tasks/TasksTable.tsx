'use client';

import { useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import { updateTask } from '../actions';

interface Task {
    id: string;
    title: string;
    status: string;
    priority?: string | null;
    dueDate?: Date | null;
    startDate?: Date | null;
    tags?: string | null;
    legacyId?: string | null;
    legacyOwner?: string | null;
    legacyStatus?: string | null;
    legacyTeam?: string | null;
    legacyMeeting?: string | null;
    assignee?: { name: string | null } | null;
    assigneeId?: string | null;
    teamId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export default function TasksTable({ initialTasks }: { initialTasks: Task[] }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        { header: 'Title', accessorKey: 'title' as keyof Task },
        { header: 'Status', accessorKey: 'status' as keyof Task },
        { header: 'Priority', accessorKey: 'priority' as keyof Task },
        {
            header: 'Due Date',
            accessorKey: 'dueDate' as keyof Task,
            cell: (row: Task) => row.dueDate ? new Date(row.dueDate).toLocaleDateString() : '-'
        },
        {
            header: 'Assignee',
            accessorKey: 'assignee' as keyof Task,
            cell: (row: Task) => row.assignee?.name || 'Unassigned'
        },
    ];

    const handleRowClick = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask) return;

        const formData = new FormData(e.target as HTMLFormElement);
        const title = formData.get('title') as string;
        const status = formData.get('status') as string;
        const priority = formData.get('priority') as string;

        await updateTask(selectedTask.id, { title, status, priority });

        // Optimistic update (or just refresh from server via router.refresh() if needed, but actions revalidate)
        setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, title, status, priority } : t));
        setIsModalOpen(false);
    };

    return (
        <>
            <DataTable data={tasks} columns={columns} onRowClick={handleRowClick} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Task Details"
            >
                {selectedTask && (
                    <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500">ID</p>
                                <p className="text-sm text-gray-900">{selectedTask.id}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Legacy ID</p>
                                <p className="text-sm text-gray-900">{selectedTask.legacyId || '-'}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500">Title</p>
                            <p className="text-sm text-gray-900">{selectedTask.title}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500">Status</p>
                                <p className="text-sm text-gray-900">{selectedTask.status}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Legacy Status</p>
                                <p className="text-sm text-gray-900">{selectedTask.legacyStatus || '-'}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500">Priority</p>
                            <p className="text-sm text-gray-900">{selectedTask.priority || '-'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500">Start Date</p>
                                <p className="text-sm text-gray-900">
                                    {selectedTask.startDate ? new Date(selectedTask.startDate).toLocaleDateString() : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Due Date</p>
                                <p className="text-sm text-gray-900">
                                    {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : '-'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500">Assignee</p>
                            <p className="text-sm text-gray-900">{selectedTask.assignee?.name || 'Unassigned'}</p>
                            <p className="text-xs text-gray-400">ID: {selectedTask.assigneeId || '-'}</p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500">Team ID</p>
                            <p className="text-sm text-gray-900">{selectedTask.teamId || '-'}</p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500">Legacy Team</p>
                            <p className="text-sm text-gray-900">{selectedTask.legacyTeam || '-'}</p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500">Meeting</p>
                            <p className="text-sm text-gray-900 font-mono text-xs break-all">{selectedTask.legacyMeeting || '-'}</p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500">Legacy Owner</p>
                            <p className="text-sm text-gray-900">{selectedTask.legacyOwner || '-'}</p>
                        </div>

                        <div>
                            <p className="text-xs font-medium text-gray-500">Tags</p>
                            <p className="text-sm text-gray-900">{selectedTask.tags || '-'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500">Created At</p>
                                <p className="text-sm text-gray-900">
                                    {selectedTask.createdAt ? new Date(selectedTask.createdAt).toLocaleString() : '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Updated At</p>
                                <p className="text-sm text-gray-900">
                                    {selectedTask.updatedAt ? new Date(selectedTask.updatedAt).toLocaleString() : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
