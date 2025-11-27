'use client';

import { useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import Modal from '../../../components/ui/Modal';
import { updateMeeting } from '../actions';

interface Meeting {
    id: string;
    title: string;
    date: Date;
    startTime: Date | null;
    endTime: Date | null;
}

export default function MeetingsTable({ initialMeetings }: { initialMeetings: Meeting[] }) {
    const [meetings, setMeetings] = useState(initialMeetings);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = [
        { header: 'Title', accessorKey: 'title' as keyof Meeting },
        {
            header: 'Date',
            accessorKey: 'date' as keyof Meeting,
            cell: (row: Meeting) => new Date(row.date).toLocaleDateString()
        },
        {
            header: 'Start Time',
            accessorKey: 'startTime' as keyof Meeting,
            cell: (row: Meeting) => row.startTime ? new Date(row.startTime).toLocaleTimeString() : '-'
        },
        {
            header: 'End Time',
            accessorKey: 'endTime' as keyof Meeting,
            cell: (row: Meeting) => row.endTime ? new Date(row.endTime).toLocaleTimeString() : '-'
        },
    ];

    const handleRowClick = (meeting: Meeting) => {
        setSelectedMeeting(meeting);
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMeeting) return;

        const formData = new FormData(e.target as HTMLFormElement);
        const title = formData.get('title') as string;
        // Handle date/time updates if needed

        await updateMeeting(selectedMeeting.id, { title });

        setMeetings(meetings.map(m => m.id === selectedMeeting.id ? { ...m, title } : m));
        setIsModalOpen(false);
    };

    return (
        <>
            <DataTable data={meetings} columns={columns} onRowClick={handleRowClick} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Edit Meeting"
            >
                {selectedMeeting && (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                name="title"
                                defaultValue={selectedMeeting.title}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                            />
                        </div>
                        {/* Add date/time pickers here */}
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
