'use client';

import styles from "./donations.module.css";
import { FiHeart, FiMessageCircle, FiCreditCard, FiGlobe } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

interface DonationsContentProps {
    settings: any;
}

export default function DonationsContent({ settings }: DonationsContentProps) {
    const { t } = useLanguage();

    const heroImage = settings.imageUrl || "/uploads/default-donation-hero.png";
    const whatsappMessage = encodeURIComponent("Hello Savannah United Berlin, I have just made a donation and attached my receipt. Please verify!");
    const whatsappUrl = `https://wa.me/${settings.whatsappPhone.replace(/\\D/g, '')}?text=${whatsappMessage}`;

    return (
        <div className={styles.main}>
            {/* Dynamic Hero Section */}
            <section className={styles.heroSection} style={{ backgroundImage: `url(${heroImage})` }}>
                <div className={styles.heroOverlay}></div>
                <div className={`container ${styles.heroContent} animate-fade-in`}>
                    <h1>{t('donations.header')}</h1>
                    <p className={styles.heroSubtitle}>
                        {t('donations.subtitle')}
                    </p>
                </div>
            </section>

            <section className="section bg-light">
                <div className="container">

                    {/* Live Counter */}
                    <div className={`${styles.counterSection} animate-fade-in`}>
                        <div className={styles.heartIconWrapper}>
                            <FiHeart size={48} className={styles.heartIcon} />
                        </div>
                        <h2>{t('donations.joinDonors')}</h2>
                        <div className={styles.counterBox}>
                            <span className={styles.counterNumber}>{settings.totalCount}</span>
                            <span className={styles.counterLabel}>{t('donations.verifiedCounter')}</span>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        {/* Box Left: Why Support Matters & Impact Tiers */}
                        <div className={styles.contentColumn}>
                            <div className={`${styles.card} glass-panel`} style={{ height: 'auto', marginBottom: 'var(--spacing-xl)' }}>
                                <div className={styles.cardHeader}>
                                    <h3>{t('donations.whyTitle')}</h3>
                                </div>
                                <div className={styles.cardBody}>
                                    <p className={styles.cardText}>
                                        {t('donations.whyDesc1')}
                                    </p>
                                    <p className={styles.cardText}>
                                        <strong>{t('donations.whyStrong')}</strong>
                                    </p>
                                    <p className={styles.cardText}>
                                        {t('donations.whyProviding')}
                                    </p>
                                    <ul className={styles.impactList}>
                                        <li>{t('donations.impactEdu')}</li>
                                        <li>{t('donations.impactRelief')}</li>
                                        <li>{t('donations.impactResettlement')}</li>
                                    </ul>
                                </div>
                            </div>

                            <div className={`${styles.card} glass-panel`} style={{ height: 'auto' }}>
                                <div className={styles.cardHeader}>
                                    <h3>{t('donations.tiersTitle')}</h3>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.tierGrid}>
                                        <div className={styles.tierItem}>
                                            <span className={styles.tierAmount}>€25</span>
                                            <span className={styles.tierDesc}>{t('donations.tier25')}</span>
                                        </div>
                                        <div className={styles.tierItem}>
                                            <span className={styles.tierAmount}>€50</span>
                                            <span className={styles.tierDesc}>{t('donations.tier50')}</span>
                                        </div>
                                        <div className={styles.tierItem}>
                                            <span className={styles.tierAmount}>€100</span>
                                            <span className={styles.tierDesc}>{t('donations.tier100')}</span>
                                        </div>
                                        <div className={styles.tierItem}>
                                            <span className={styles.tierAmount}>Custom</span>
                                            <span className={styles.tierDesc}>{t('donations.tierCustom')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Box Right: Transfer Details & WhatsApp */}
                        <div className={styles.actionColumn}>
                            {/* Box 1: Bank Transfer Details */}
                            <div className={`${styles.card} glass-panel`} style={{ marginBottom: 'var(--spacing-xl)' }}>
                                <div className={styles.cardHeader}>
                                    <FiCreditCard size={24} className={styles.icon} />
                                    <h3>{t('donations.bankTransfer')}</h3>
                                </div>
                                <div className={styles.cardBody}>
                                    <p className={styles.cardText}>
                                        {t('donations.bankDesc')}
                                    </p>

                                    <div className={styles.bankDetails}>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>{t('donations.bankName')}</span>
                                            <span className={styles.detailValue}>{settings.bankName}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>{t('donations.accountName')}</span>
                                            <span className={styles.detailValue}>{settings.accountName}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>{t('donations.iban')}</span>
                                            <span className={styles.detailValue}>{settings.iban}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>{t('donations.bic')}</span>
                                            <span className={styles.detailValue}>{settings.bic}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>{t('donations.reference')}</span>
                                            <span className={styles.detailValue}>{t('donations.referenceValue')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Box 2: WhatsApp Receipt Instructions */}
                            <div className={`${styles.card} glass-panel`}>
                                <div className={styles.cardHeader}>
                                    <FiMessageCircle size={24} className={styles.icon} />
                                    <h3>{t('donations.receipt')}</h3>
                                </div>
                                <div className={styles.cardBody}>
                                    <p className={styles.cardText}>
                                        {t('donations.receiptDesc1')}
                                    </p>
                                    <p className={styles.cardText}>
                                        {t('donations.receiptDesc2')}
                                    </p>

                                    <div className={styles.whatsappAction}>
                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${styles.whatsappBtn}`}>
                                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                            {t('donations.whatsappBtn')}
                                        </a>
                                    </div>

                                    <div className={styles.securityNote}>
                                        <FiGlobe size={16} />
                                        <span>{t('donations.securityNote')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust & Transparency Footer */}
                    <div className={styles.trustSection}>
                        <p>{t('donations.trustNote')}</p>
                    </div>

                </div>
            </section>
        </div>
    );
}
