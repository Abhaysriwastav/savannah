'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Navigation.module.css';
import { FiMenu, FiX, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '@/context/LanguageContext';

export default function Navigation() {
    const pathname = usePathname();
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const NAV_LINKS = [
        { href: '/', label: t('common.home') },
        { href: '/about-us', label: t('common.aboutUs') },
        { href: '/events', label: t('common.events') },
        { href: '/projects', label: t('common.projects') },
        { href: '/gallery', label: t('common.gallery') },
        { href: '/contact', label: t('common.contactUs') },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsOpen(false);
    }, [pathname]);

    // Don't display navigation on admin pages
    if (pathname.startsWith('/admin') || pathname === '/login') {
        return null;
    }

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'de' : 'en');
    };

    return (
        <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <img src="/logo.png" alt="Savannah United Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                        <span className={styles.primaryText}>{t('nav.brand').split(' ')[0]}</span>
                        <span className={styles.secondaryText}>{t('nav.brand').split(' ')[1]}</span>
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

                    <button onClick={toggleLanguage} className={styles.langToggle} aria-label="Toggle Language">
                        <FiGlobe />
                        <span>{language === 'en' ? 'DE' : 'EN'}</span>
                    </button>

                    <Link href="/donations" className="btn btn-primary">
                        {t('common.donate')}
                    </Link>
                </nav>

                {/* Mobile Toggle Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={toggleLanguage} className={styles.mobileLangToggle} aria-label="Toggle Language">
                        {language === 'en' ? 'DE' : 'EN'}
                    </button>
                    <button
                        className={styles.mobileToggle}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle navigation menu"
                    >
                        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
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
                        {t('common.donate')}
                    </Link>
                </div>
            </nav>
        </header>
    );
}
