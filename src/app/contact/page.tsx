import styles from "./contact.module.css";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

export default function ContactUs() {
    return (
        <div className={styles.main}>
            {/* Page Header */}
            <section className={styles.pageHeader}>
                <div className="container text-center animate-fade-in">
                    <h1>Contact Us</h1>
                    <p className={styles.subtitle}>We'd love to hear from you</p>
                </div>
            </section>

            <section className="section">
                <div className={`container ${styles.contactGrid}`}>
                    {/* Contact Information */}
                    <div className={styles.contactInfo}>
                        <h2>Get In Touch</h2>
                        <p>If you have any questions about our projects, volunteering, or donations, feel free to contact us using the details below or fill out the form.</p>

                        <div className={styles.infoCards}>
                            <div className={`${styles.infoCard} glass-panel`}>
                                <FiPhone className={styles.icon} />
                                <h3>Phone</h3>
                                <p>(+49)15-2102-85342</p>
                            </div>

                            <div className={`${styles.infoCard} glass-panel`}>
                                <FiMail className={styles.icon} />
                                <h3>Email</h3>
                                <a href="mailto:info@savannahunited.com">info@savannahunited.com</a>
                            </div>

                            <div className={`${styles.infoCard} glass-panel`}>
                                <FiMapPin className={styles.icon} />
                                <h3>Location</h3>
                                <p>Berlin-Brandenburg, Germany</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form Placeholder */}
                    <div className={`${styles.formContainer} glass-panel`}>
                        <h2>Send a Message</h2>
                        <form className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Full Name</label>
                                <input type="text" id="name" placeholder="John Doe" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email Address</label>
                                <input type="email" id="email" placeholder="john@example.com" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="subject">Subject</label>
                                <input type="text" id="subject" placeholder="How can we help you?" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="message">Message</label>
                                <textarea id="message" rows={5} placeholder="Your message here..." required></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Message</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
