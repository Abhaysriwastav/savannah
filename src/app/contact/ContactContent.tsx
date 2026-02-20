'use client';

import styles from "./contact.module.css";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

interface ContactContentProps {
    headerImageUrl?: string | null;
}

export default function ContactContent({ headerImageUrl }: ContactContentProps) {
    const { t } = useLanguage();

    return (
        <div className={styles.main}>
            {/* Page Header */}
            <section
                className={styles.pageHeader}
                style={headerImageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${headerImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
                <div className="container text-center animate-fade-in">
                    <h1>{t('contact.header')}</h1>
                    <p className={styles.subtitle}>{t('contact.subtitle')}</p>
                </div>
            </section>

            <section className="section">
                <div className={`container ${styles.contactGrid}`}>
                    {/* Contact Information */}
                    <div className={styles.contactInfo}>
                        <h2>{t('contact.getInTouch')}</h2>
                        <p>{t('contact.contactDesc')}</p>

                        <div className={styles.infoCards}>
                            <div className={`${styles.infoCard} glass-panel`}>
                                <FiPhone className={styles.icon} />
                                <h3>{t('contact.phone')}</h3>
                                <p>(+49)15-2102-85342</p>
                            </div>

                            <div className={`${styles.infoCard} glass-panel`}>
                                <FiMail className={styles.icon} />
                                <h3>{t('contact.email')}</h3>
                                <a href="mailto:info@savannahunited.com">info@savannahunited.com</a>
                            </div>

                            <div className={`${styles.infoCard} glass-panel`}>
                                <FiMapPin className={styles.icon} />
                                <h3>{t('contact.location')}</h3>
                                <p>{t('contact.berlin')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Placeholder */}
                    <div className={`${styles.formContainer} glass-panel`}>
                        <h2>{t('contact.sendMessage')}</h2>
                        <form className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">{t('contact.fullName')}</label>
                                <input type="text" id="name" placeholder={t('contact.placeholderName')} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">{t('contact.emailAddress')}</label>
                                <input type="email" id="email" placeholder={t('contact.placeholderEmail')} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="subject">{t('contact.subject')}</label>
                                <input type="text" id="subject" placeholder={t('contact.placeholderSubject')} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="message">{t('contact.message')}</label>
                                <textarea id="message" rows={5} placeholder={t('contact.placeholderMessage')} required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{t('contact.sendBtn')}</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
