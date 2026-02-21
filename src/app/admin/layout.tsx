'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiCalendar, FiImage, FiLogOut, FiHome, FiHeart, FiTarget, FiLayers, FiMail, FiPhone, FiBarChart2, FiUsers } from 'react-icons/fi';
import styles from './admin.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userPermissions, setUserPermissions] = useState<string[]>([]);

    useEffect(() => {
        const fetchUserPermissions = async () => {
            try {
                const res = await fetch('/api/me');
                if (res.ok) {
                    const data = await res.json();
                    setUserRole(data.role);
                    setUserPermissions(data.permissions || []);
                }
            } catch (error) {
                console.error("Failed to fetch user permissions");
            }
        };
        fetchUserPermissions();
    }, []);

    const navItems = [
        { href: '/admin/events', label: 'Manage Events', icon: FiCalendar, permission: 'manage_events' },
        { href: '/admin/gallery', label: 'Manage Gallery', icon: FiImage, permission: 'manage_gallery' },
        { href: '/admin/donations', label: 'Manage Donations', icon: FiHeart },
        { href: '/admin/projects', label: 'Manage Projects', icon: FiTarget, permission: 'manage_projects' },
        { href: '/admin/about', label: 'Manage About Us', icon: FiImage },
        { href: '/admin/contact', label: 'Contact Info', icon: FiPhone },
        { href: '/admin/impact', label: 'Impact Dashboard', icon: FiBarChart2 },
        { href: '/admin/headers', label: 'Page Headers', icon: FiLayers },
        { href: '/admin/messages', label: 'Inquiries', icon: FiMail },
        { href: '/admin/users', label: 'User Management', icon: FiUsers },
    ];

    const visibleNavItems = navItems.filter(item => {
        if (userRole === 'superadmin') return true; // Superadmin sees all
        if (!item.permission) return false; // Editor CANNOT see items without explicit permission mapping (the superadmin only routes)
        return userPermissions.includes(item.permission);
    });

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Admin Portal</h2>
                    <Link href="/" className={styles.homeLink}>
                        <FiHome /> Back to Site
                    </Link>
                </div>
                <nav className={styles.navigation}>
                    {visibleNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                            >
                                <Icon className={styles.icon} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <div className={styles.divider}></div>

                    <Link href="/" className={styles.navItem}>
                        <FiHome className={styles.icon} />
                        <span>View Site</span>
                    </Link>

                    <Link
                        href="/api/logout"
                        className={`${styles.navItem} ${styles.logoutText}`}
                        prefetch={false}
                    >
                        <FiLogOut className={styles.icon} />
                        <span>Logout</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    {children}
                </div>
            </main>
        </div>
    );
}
