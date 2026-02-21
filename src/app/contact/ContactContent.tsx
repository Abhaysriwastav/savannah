'use client';

import { useState } from "react";
import styles from "./contact.module.css";
import { FiMapPin, FiPhone, FiMail, FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

interface ContactContentProps {
    headerImageUrl?: string | null;
    contactSettings?: any;
}

export default function ContactContent({ headerImageUrl, contactSettings }: ContactContentProps) {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', text: '' });

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus({ type: 'success', text: t('contact.successMsg') || 'Thank you! Your message has been sent.' });
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus({ type: 'error', text: data.error || 'Something went wrong. Please try again.' });
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'Network error. Please check your connection.' });
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                <p>{contactSettings?.phone || '(+49)15-2102-85342'}</p>
                            </div>

                            <div className={`${styles.infoCard} glass-panel`}>
                                <FiMail className={styles.icon} />
                                <h3>{t('contact.email')}</h3>
                                <a href={`mailto:${contactSettings?.email || 'info@savannahunited.com'}`}>
                                    {contactSettings?.email || 'info@savannahunited.com'}
                                </a>
                            </div>

                            <div className={`${styles.infoCard} glass-panel`}>
                                <FiMapPin className={styles.icon} />
                                <h3>{t('contact.location')}</h3>
                                <p>{contactSettings?.address || t('contact.berlin')}</p>
                            </div>
                        </div>

                        {contactSettings?.locationUrl && (
                            <div className={styles.mapContainer} style={{ marginTop: '2rem', borderRadius: '12px', overflow: 'hidden', height: '300px' }}>
                                <iframe
                                    src={contactSettings.locationUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>
                        )}
                    </div>

                    {/* Contact Form */}
                    <div className={`${styles.formContainer} glass-panel`}>
                        <h2>{t('contact.sendMessage')}</h2>

                        {status.text && (
                            <div className={`${styles.statusMsg} ${styles[status.type]}`}>
                                {status.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                                {status.text}
                            </div>
                        )}

                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">{t('contact.fullName')}</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder={t('contact.placeholderName')}
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">{t('contact.emailAddress')}</label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder={t('contact.placeholderEmail')}
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="subject">{t('contact.subject')}</label>
                                <input
                                    type="text"
                                    id="subject"
                                    placeholder={t('contact.placeholderSubject')}
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="message">{t('contact.message')}</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    placeholder={t('contact.placeholderMessage')}
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Sending...' : <><FiSend /> {t('contact.sendBtn')}</>}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
