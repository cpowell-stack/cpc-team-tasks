'use client';

import { useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import { updateUser } from '../actions';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    role?: string | null;
    assignment?: string | null;
    vacationDaysAllowed?: number | null;
    supervisor?: { name: string | null } | null;
}

export default function UsersTable({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = useState(initialUsers);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        { header: 'Name', accessorKey: 'name' as keyof User },
        { header: 'Email', accessorKey: 'email' as keyof User },
        { header: 'Role', accessorKey: 'role' as keyof User },
        { header: 'Assignment', accessorKey: 'assignment' as keyof User },
        { header: 'Vacation Days', accessorKey: 'vacationDaysAllowed' as keyof User },
        {
            header: 'Supervisor',
            accessorKey: 'supervisor' as keyof User,
            cell: (row: User) => row.supervisor?.name || '-'
        },
    ];

    const handleRowClick = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const role = formData.get('role') as string;
        const assignment = formData.get('assignment') as string;
        const vacationDaysAllowed = parseInt(formData.get('vacationDaysAllowed') as string, 10);

        await updateUser(selectedUser.id, { name, role, assignment, vacationDaysAllowed });

        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, name, role, assignment, vacationDaysAllowed } : u));
        setIsModalOpen(false);
    };

    return (
        <>
            <DataTable data={users} columns={columns} onRowClick={handleRowClick} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Edit User"
            >
                {selectedUser && (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                name="name"
                                defaultValue={selectedUser.name || ''}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <input
                                name="role"
                                defaultValue={selectedUser.role || ''}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Assignment</label>
                            <input
                                name="assignment"
                                defaultValue={selectedUser.assignment || ''}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vacation Days Allowed</label>
                            <input
                                name="vacationDaysAllowed"
                                type="number"
                                defaultValue={selectedUser.vacationDaysAllowed || 0}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </>
    );
}
