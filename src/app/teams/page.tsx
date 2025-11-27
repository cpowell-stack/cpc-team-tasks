import { teamRepository } from '@/lib/repositories/TeamRepository';
import TeamsTable from './TeamsTable';

export default async function TeamsPage() {
    const teams = await teamRepository.getAllTeams();
    teams.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Teams</h1>
            <TeamsTable initialTeams={teams} />
        </div>
    );
}
