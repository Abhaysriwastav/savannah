import Link from 'next/link';
import { FiCalendar, FiImage, FiLogOut, FiHome, FiHeart, FiTarget, FiLayers } from 'react-icons/fi';
import styles from './admin.module.css';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.adminContainer}>
            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2>Admin Panel</h2>
                </div>

                <nav className={styles.sidebarNav}>
                    <Link href="/admin/events" className={styles.navItem}>
                        <FiCalendar className={styles.icon} />
                        <span>Manage Events</span>
                    </Link>

                    <Link href="/admin/gallery" className={styles.navItem}>
                        <FiImage className={styles.icon} />
                        <span>Manage Gallery</span>
                    </Link>

                    <Link href="/admin/donations" className={styles.navItem}>
                        <FiHeart className={styles.icon} />
                        <span>Manage Donations</span>
                    </Link>

                    <Link href="/admin/projects" className={styles.navItem}>
                        <FiTarget className={styles.icon} />
                        <span>Manage Projects</span>
                    </Link>

                    <Link href="/admin/about" className={styles.navItem}>
                        <FiImage className={styles.icon} />
                        <span>Manage About Us</span>
                    </Link>

                    <Link href="/admin/headers" className={styles.navItem}>
                        <FiLayers className={styles.icon} />
                        <span>Manage Page Headers</span>
                    </Link>

                    <div className={styles.divider}></div>

                    <Link href="/" className={styles.navItem}>
                        <FiHome className={styles.icon} />
                        <span>View Site</span>
                    </Link>

                    {/* We will handle logout client-side, but a simple link to a logout API works too.
              For simplicity, let's use a server action or API route for logout. */}
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
