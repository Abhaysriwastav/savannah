'use client';

import { useState, useEffect } from 'react';
import styles from './PartnersMarquee.module.css';

interface Partner {
    id: string;
    name: string;
    logoUrl: string | null;
}

export default function PartnersMarquee() {
    const [partners, setPartners] = useState<Partner[]>([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const res = await fetch('/api/partners');
                if (res.ok) {
                    const data = await res.json();
                    setPartners(data);
                }
            } catch (error) {
                console.error("Failed to fetch partners", error);
            }
        };
        fetchPartners();
    }, []);

    // Duplicate the array to create a seamless infinite loop
    const doubledPartners = [...partners, ...partners];

    return (
        <section style={{ margin: 'var(--spacing-xxl) 0', textAlign: 'center', position: 'relative', zIndex: 2 }}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>Our Trusted Partners</h2>
            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeTrack}>
                    {partners.length === 0 ? (
                        <div style={{ padding: '20px', color: 'var(--text-secondary)' }}>
                            Proudly partnering with local and global organizations.
                        </div>
                    ) : (
                        doubledPartners.map((partner, index) => (
                            <div key={index} className={styles.partnerLogo}>
                                {partner.logoUrl ? (
                                    <img src={partner.logoUrl} alt={partner.name} style={{ maxWidth: '100%', maxHeight: '60px', objectFit: 'contain' }} />
                                ) : (
                                    partner.name
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
