import styles from "./donations.module.css";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiHeart, FiMessageCircle, FiCreditCard, FiGlobe } from "react-icons/fi";

export const dynamic = 'force-dynamic';

export default async function Donations() {
    let settings = await prisma.donationSettings.findFirst();

    if (!settings) {
        settings = {
            id: "default",
            bankName: "Loading...",
            accountName: "Loading...",
            iban: "Loading...",
            bic: "Loading...",
            whatsappPhone: "",
            imageUrl: "/uploads/default-donation-hero.png",
            totalCount: 0,
            updatedAt: new Date()
        };
    }

    // Fallback if the URL exists but is empty
    const heroImage = settings.imageUrl || "/uploads/default-donation-hero.png";

    const whatsappMessage = encodeURIComponent("Hello Savannah United Berlin, I have just made a donation and attached my receipt. Please verify!");
    const whatsappUrl = `https://wa.me/${settings.whatsappPhone.replace(/\\D/g, '')}?text=${whatsappMessage}`;

    return (
        <div className={styles.main}>
            {/* Dynamic Hero Section */}
            <section className={styles.heroSection} style={{ backgroundImage: `url(${heroImage})` }}>
                <div className={styles.heroOverlay}></div>
                <div className={`container ${styles.heroContent} animate-fade-in`}>
                    <h1>Together, We Can Heal the World's Hardest-Hit Communities</h1>
                    <p className={styles.heroSubtitle}>
                        Your support provides education, humanitarian aid, and a new beginning for those displaced by disaster and conflict.
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
                        <h2>Join Our Community of Donors</h2>
                        <div className={styles.counterBox}>
                            <span className={styles.counterNumber}>{settings.totalCount}</span>
                            <span className={styles.counterLabel}>Verified Donations Received</span>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        {/* Box Left: Why Support Matters & Impact Tiers */}
                        <div className={styles.contentColumn}>
                            <div className={`${styles.card} glass-panel`} style={{ height: 'auto', marginBottom: 'var(--spacing-xl)' }}>
                                <div className={styles.cardHeader}>
                                    <h3>Why Your Support Matters</h3>
                                </div>
                                <div className={styles.cardBody}>
                                    <p className={styles.cardText}>
                                        At Savannah United Berlin e.V., we believe that humanity knows no borders. Whether it is protecting our neighbors in Berlin-Brandenburg during a bitter winter or rebuilding lives for those fleeing conflict in Northeastern Nigeria, we are on the front lines.
                                    </p>
                                    <p className={styles.cardText}>
                                        <strong>But we cannot do it alone.</strong>
                                    </p>
                                    <p className={styles.cardText}>
                                        When you donate today, you aren't just giving money; you are providing:
                                    </p>
                                    <ul className={styles.impactList}>
                                        <li><strong>Education:</strong> Giving children in Nigeria the tools to dream beyond the classroom.</li>
                                        <li><strong>Emergency Relief:</strong> Providing food, warmth, and shelter to the homeless in Berlin.</li>
                                        <li><strong>Resettlement:</strong> Helping families displaced by Boko Haram find safety and dignity once again.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className={`${styles.card} glass-panel`} style={{ height: 'auto' }}>
                                <div className={styles.cardHeader}>
                                    <h3>Tangible Impact Tiers</h3>
                                </div>
                                <div className={styles.cardBody}>
                                    <div className={styles.tierGrid}>
                                        <div className={styles.tierItem}>
                                            <span className={styles.tierAmount}>€25</span>
                                            <span className={styles.tierDesc}>Provides a "Winter Kit" (socks, gloves, and warm meals) for a homeless person in Berlin.</span>
                                        </div>
                                        <div className={styles.tierItem}>
                                            <span className={styles.tierAmount}>€50</span>
                                            <span className={styles.tierDesc}>Covers educational materials and school supplies for three students in Nigeria.</span>
                                        </div>
                                        <div className={styles.tierItem}>
                                            <span className={styles.tierAmount}>€100</span>
                                            <span className={styles.tierDesc}>Supports the resettlement of a displaced family with essential household supplies.</span>
                                        </div>
                                        <div className={styles.tierItem}>
                                            <span className={styles.tierAmount}>Custom</span>
                                            <span className={styles.tierDesc}>Every Euro goes directly toward our mission of socio-economic integration.</span>
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
                                    <h3>Manual Bank Transfer</h3>
                                </div>
                                <div className={styles.cardBody}>
                                    <p className={styles.cardText}>
                                        You can support our ongoing projects by making a direct bank transfer to our official NGO account.
                                    </p>

                                    <div className={styles.bankDetails}>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Bank Name</span>
                                            <span className={styles.detailValue}>{settings.bankName}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Account Holder</span>
                                            <span className={styles.detailValue}>{settings.accountName}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>IBAN</span>
                                            <span className={styles.detailValue}>{settings.iban}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>BIC / SWIFT</span>
                                            <span className={styles.detailValue}>{settings.bic}</span>
                                        </div>
                                        <div className={styles.detailRow}>
                                            <span className={styles.detailLabel}>Reference</span>
                                            <span className={styles.detailValue}>Donation - [Your Name]</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Box 2: WhatsApp Receipt Instructions */}
                            <div className={`${styles.card} glass-panel`}>
                                <div className={styles.cardHeader}>
                                    <FiMessageCircle size={24} className={styles.icon} />
                                    <h3>Send Us Your Receipt</h3>
                                </div>
                                <div className={styles.cardBody}>
                                    <p className={styles.cardText}>
                                        After completing your transfer, please send a screenshot or PDF of your transfer receipt to our official WhatsApp.
                                    </p>
                                    <p className={styles.cardText}>
                                        Once our team verifies the transfer, your contribution will be added to the live donation counter above!
                                    </p>

                                    <div className={styles.whatsappAction}>
                                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-primary ${styles.whatsappBtn}`}>
                                            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                            Send Receipt via WhatsApp
                                        </a>
                                    </div>

                                    <div className={styles.securityNote}>
                                        <FiGlobe size={16} />
                                        <span>Your data is processed securely and confidentially.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust & Transparency Footer */}
                    <div className={styles.trustSection}>
                        <p>
                            "We are committed to direct action. Through our partnerships in Nigeria and Germany, we ensure your contribution reaches the hands of those who need it most, with full transparency and passion."
                        </p>
                    </div>

                </div>
            </section>
        </div>
    );
}
