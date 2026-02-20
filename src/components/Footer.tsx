'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

export default function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith('/admin') || pathname === '/login') {
        return null;
    }

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>

                    <div className={styles.brandColumn}>
                        <Link href="/" className={styles.logo}>
                            <img src="/logo.png" alt="Savannah United Logo" width={45} height={45} style={{ objectFit: 'contain' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                                <span className={styles.primaryText}>Savannah</span>
                                <span className={styles.secondaryText}>United</span>
                            </div>
                        </Link>
                        <p className={styles.description}>
                            A nonprofit organization driven by the passion for Socio-economic integration
                            and Humanitarian aids to the needy.
                        </p>
                    </div>

                    <div className={styles.linksColumn}>
                        <h3 className={styles.columnTitle}>Quick Links</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="/about-us">About Us</Link></li>
                            <li><Link href="/events">Events</Link></li>
                            <li><Link href="/gallery">Gallery</Link></li>
                            <li><Link href="/contact">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div className={styles.contactColumn}>
                        <h3 className={styles.columnTitle}>Contact Us</h3>
                        <ul className={styles.contactList}>
                            <li>
                                <strong>Phone:</strong> <br />(+49)15-2102-85342
                            </li>
                            <li>
                                <strong>Email:</strong> <br />
                                <a href="mailto:info@savannahunited.com">
                                    info@savannahunited.com
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className={styles.bottomBar}>
                    <p>&copy; {new Date().getFullYear()} Savannah United Berlin e.V. All rights reserved.</p>
                    <Link href="/login" className={styles.adminLink}>Admin Login</Link>
                </div>
            </div>
        </footer>
    );
}
