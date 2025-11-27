import MeetingsTable from './MeetingsTable';

export default async function MeetingsPage() {
    // Meetings not supported
    const meetings: any[] = [];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Meetings</h1>
            <MeetingsTable initialMeetings={meetings} />
        </div>
    );
}
