import { Outlet, Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
    LayoutDashboard,
    BookOpen,
    Factory,
    Users,
    Settings,
    LogOut,
    Calendar,
    FolderTree,
    Library,
    ExternalLink,
    Database
} from 'lucide-react';
import { Toaster } from '../../components/ui/toaster';

export const AdminLayout = () => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Factory, label: 'Content Factory', path: '/admin/content-factory' },
        { icon: Database, label: 'Content Queue', path: '/admin/queue' },
        { icon: FolderTree, label: 'Topics Manager', path: '/admin/topics' },
        { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
        { icon: Calendar, label: 'Schedule', path: '/admin/schedule' },
        { icon: Users, label: 'Students', path: '/admin/students' },
        { icon: Library, label: 'View Library', path: '/resources', external: true },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const isActiveRoute = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-black text-black dark:text-white font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-black/5 dark:border-white/10 bg-white dark:bg-[#09090b] flex flex-col fixed inset-y-0 z-50">
                <div className="p-6 border-b border-black/5 dark:border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#DB2777] flex items-center justify-center font-bold text-white shadow-lg">
                        A
                    </div>
                    <span className="font-bold tracking-tight">PERTUTO ADMIN</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = isActiveRoute(item.path);
                        const isExternal = 'external' in item && item.external;

                        if (isExternal) {
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    target="_blank"
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                    <ExternalLink size={12} className="ml-auto opacity-50" />
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-black/5 dark:bg-white/10 text-black dark:text-white"
                                        : "text-gray-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
                                )}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-black/5 dark:border-white/10">
                    <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>

            <Toaster />
        </div>
    );
};
