"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, CheckSquare, Calendar, LogOut, User } from "lucide-react";

export function Navigation() {
    const pathname = usePathname();
    const { data: session } = useSession();

    if (!session) return null;

    const links = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/tasks", label: "Tasks", icon: CheckSquare },
        { href: "/meetings", label: "Meetings", icon: Calendar },
    ];

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-blue-600">TeamTask</span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname.startsWith(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive
                                                ? "border-blue-500 text-gray-900"
                                                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4 mr-2" />
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                {session.user?.image ? (
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-500" />
                                    </div>
                                )}
                                <span className="text-sm font-medium text-gray-700">
                                    {session.user?.name}
                                </span>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
