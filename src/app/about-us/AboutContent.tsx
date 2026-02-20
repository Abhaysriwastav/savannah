'use client';

import styles from "./about.module.css";
import { useLanguage } from "@/context/LanguageContext";

interface AboutContentProps {
    storyImageUrl?: string | null;
    headerImageUrl?: string | null;
}

export default function AboutContent({ storyImageUrl, headerImageUrl }: AboutContentProps) {
    const { t } = useLanguage();

    return (
        <div className={styles.main}>
            {/* Page Header */}
            <section
                className={styles.pageHeader}
                style={headerImageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${headerImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
                <div className="container text-center animate-fade-in">
                    <h1>{t('about.header')}</h1>
                    <p className={styles.subtitle}>{t('about.subtitle')}</p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section">
                <div className={`container ${styles.grid}`}>
                    <div className={`${styles.card} glass-panel`}>
                        <h2>{t('about.mission')}</h2>
                        <p>
                            To engage in humanitarian aid in Germany (focal point Berlin-Brandenburg)
                            where our members live, and improve the lives of the needy and displaced
                            persons in Nigeria as a result of natural disasters, human negligence,
                            war, and/or terrorism.
                        </p>
                        <p>We try our very best to support HUMANITY in any way possible.</p>
                    </div>
                    <div className={`${styles.card} glass-panel`}>
                        <h2>{t('about.vision')}</h2>
                        <p>
                            A world where socio-economic integration is seamless, and communities
                            are empowered with the resources they need to thrive regardless of their
                            circumstances. We envision a society defined by unity, education, and
                            sustainable development.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story / Background */}
            <section className={`section ${styles.storySection} bg-light`}>
                <div className="container">
                    <div className={styles.storyContent}>
                        <div className={styles.storyText}>
                            <h2>{t('about.story')}</h2>
                            <p>
                                Savannah United Berlin e.V is a nonprofit organization driven by the passion
                                for Socio-economic integration and Humanitarian aids to the needy. Founded
                                by a group of dedicated individuals, our organization has grown to support
                                thousands of individuals across continents.
                            </p>
                            <br />
                            <p>
                                Whether it's donating educational materials to schools in Nigeria or fostering
                                integration programs in Berlin, we believe that collective action can yield
                                extraordinary results.
                            </p>
                        </div>
                        <div className={styles.storyImage}>
                            {storyImageUrl ? (
                                <img
                                    src={storyImageUrl}
                                    alt="Community Impact"
                                    className={styles.actualImage}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
                                />
                            ) : (
                                <div className={styles.imagePlaceholder}>
                                    {t('about.impact')}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
