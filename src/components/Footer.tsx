'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Footer.module.css';

import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
    const pathname = usePathname();
    const { t } = useLanguage();

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
                                <span className={styles.primaryText}>{t('nav.brand').split(' ')[0]}</span>
                                <span className={styles.secondaryText}>{t('nav.brand').split(' ')[1]}</span>
                            </div>
                        </Link>
                        <p className={styles.description}>
                            {t('footer.desc')}
                        </p>
                    </div>

                    <div className={styles.linksColumn}>
                        <h3 className={styles.columnTitle}>{t('footer.quickLinks')}</h3>
                        <ul className={styles.linkList}>
                            <li><Link href="/about-us">{t('common.aboutUs')}</Link></li>
                            <li><Link href="/events">{t('common.events')}</Link></li>
                            <li><Link href="/gallery">{t('common.gallery')}</Link></li>
                            <li><Link href="/contact">{t('common.contactUs')}</Link></li>
                        </ul>
                    </div>

                    <div className={styles.contactColumn}>
                        <h3 className={styles.columnTitle}>{t('footer.contactInfo')}</h3>
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
                    <p>&copy; {new Date().getFullYear()} {t('nav.brand')} Berlin e.V. {t('footer.rights')}</p>
                    <Link href="/login" className={styles.adminLink}>Admin Login</Link>
                </div>
            </div>
        </footer>
    );
}
