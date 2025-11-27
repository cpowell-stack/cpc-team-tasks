import Link from 'next/link';

export default function NavBar() {
    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">
                    Team Task Manager
                </Link>
                <div className="space-x-4">
                    <Link href="/tasks" className="hover:text-gray-300">
                        Tasks
                    </Link>
                    <Link href="/users" className="hover:text-gray-300">
                        Users
                    </Link>
                    <Link href="/teams" className="hover:text-gray-300">
                        Teams
                    </Link>
                    <Link href="/meetings" className="hover:text-gray-300">
                        Meetings
                    </Link>
                </div>
            </div>
        </nav>
    );
}
