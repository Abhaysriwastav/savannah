'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Navigation.module.css';
import { FiMenu, FiX } from 'react-icons/fi';

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/events', label: 'Events' },
    { href: '/projects', label: 'Our Projects' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact Us' },
];

export default function Navigation() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Don't display navigation on admin pages
    if (pathname.startsWith('/admin') || pathname === '/login') {
        return null;
    }

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <img src="/logo.png" alt="Savannah United Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                        <span className={styles.primaryText}>Savannah</span>
                        <span className={styles.secondaryText}>United</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.navLink} ${pathname === link.href ? styles.active : ''
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/donations" className="btn btn-primary">
                        Donate Now
                    </Link>
                </nav>

                {/* Mobile Toggle Button */}
                <button
                    className={styles.mobileToggle}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <nav className={`${styles.mobileNav} ${isOpen ? styles.open : ''}`}>
                <div className={styles.mobileNavContainer}>
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.mobileNavLink} ${pathname === link.href ? styles.active : ''
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/donations" className={`btn btn-primary ${styles.mobileDonateBtn}`}>
                        Donate Now
                    </Link>
                </div>
            </nav>
        </header>
    );
}
