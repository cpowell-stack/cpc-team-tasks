'use client';

import { useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import { updateTeam } from '../actions';

interface Team {
    id: string;
    name: string;
    legacyId?: string;
}

export default function TeamsTable({ initialTeams }: { initialTeams: Team[] }) {
    const [teams, setTeams] = useState(initialTeams);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        { header: 'Name', accessorKey: 'name' as keyof Team },
        { header: 'Legacy ID', accessorKey: 'legacyId' as keyof Team },
    ];

    const handleRowClick = (team: Team) => {
        setSelectedTeam(team);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeam) return;

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;

        await updateTeam(selectedTeam.id, { name });

        setTeams(teams.map(t => t.id === selectedTeam.id ? { ...t, name } : t));
        setIsModalOpen(false);
    };

    return (
        <>
            <DataTable data={teams} columns={columns} onRowClick={handleRowClick} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Edit Team"
            >
                {selectedTeam && (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                name="name"
                                defaultValue={selectedTeam.name}
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
