'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiCalendar, FiImage, FiLogOut, FiHome, FiHeart, FiTarget, FiLayers, FiMail, FiPhone, FiBarChart2, FiUsers, FiMenu, FiX, FiSmile, FiMessageCircle, FiGlobe } from 'react-icons/fi';
import styles from './admin.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userPermissions, setUserPermissions] = useState<string[]>([]);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

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
        { href: '/admin/projects', label: 'Manage Projects', icon: FiTarget, permission: 'manage_projects' },
        { href: '/admin/impact', label: 'Impact Dashboard', icon: FiBarChart2, permission: 'manage_impact' },
        { href: '/admin/donations', label: 'Manage Donations', icon: FiHeart, permission: 'manage_donations' },
        { href: '/admin/messages', label: 'Inquiries', icon: FiMail, permission: 'manage_messages' },
        { href: '/admin/volunteers', label: 'Volunteers', icon: FiSmile, permission: 'manage_volunteers' },
        { href: '/admin/testimonials', label: 'Testimonials', icon: FiMessageCircle, permission: 'manage_testimonials' },
        { href: '/admin/partners', label: 'Trusted Partners', icon: FiGlobe, permission: 'manage_partners' },
        { href: '/admin/about', label: 'Manage About Us', icon: FiImage },
        { href: '/admin/contact', label: 'Contact Info', icon: FiPhone },
        { href: '/admin/headers', label: 'Page Headers', icon: FiLayers },
        { href: '/admin/users', label: 'User Management', icon: FiUsers },
    ];

    const visibleNavItems = navItems.filter(item => {
        if (userRole === 'superadmin') return true; // Superadmin sees all
        if (!item.permission) return false; // Editor CANNOT see items without explicit permission mapping
        return userPermissions.includes(item.permission);
    });

    return (
        <div className={styles.adminContainer}>
            {/* Mobile Header */}
            <div className={styles.mobileHeader}>
                <Link href="/" className={styles.logoWrapper}>
                    <img src="/logo.png" alt="Savannah Logo" width={32} height={32} style={{ objectFit: 'contain' }} />
                    <div className={styles.logoText}>
                        <span className={styles.primaryText}>Savannah</span>
                        <span className={styles.secondaryText}>Admin</span>
                    </div>
                </Link>
                <button className={styles.mobileMenuBtn} onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    {isMobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`${styles.sidebar} ${isMobileOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.logoWrapper}>
                        <img src="/logo.png" alt="Savannah Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
                        <div className={styles.logoText}>
                            <span className={styles.primaryText}>Savannah</span>
                            <span className={styles.secondaryText}>Admin</span>
                        </div>
                    </Link>
                </div>
                <nav className={styles.sidebarNav}>
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

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div className={styles.mobileOverlay} onClick={() => setIsMobileOpen(false)}></div>
            )}

            {/* Main Content Area */}
            <main className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                    {children}
                </div>
            </main>
        </div>
    );
}
