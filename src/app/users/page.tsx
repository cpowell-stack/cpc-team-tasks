import { userRepository } from '@/lib/repositories/UserRepository';
import UsersTable from './UsersTable';

export default async function UsersPage() {
    const users = await userRepository.getAllUsers();
    users.sort((a, b) => a.name.localeCompare(b.name));

    // We might need to populate supervisor if the table expects it. 
    // For now, let's pass users and see.

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Users</h1>
            <UsersTable initialUsers={users} />
        </div>
    );
}
