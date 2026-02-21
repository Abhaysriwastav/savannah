'use client';

import VolunteerForm from "@/components/VolunteerForm";
import styles from "./volunteer.module.css";
import { motion } from "framer-motion";

export default function VolunteerPage() {
    return (
        <main className={styles.main}>
            {/* Dynamic Background */}
            <div className={styles.backgroundGraphics}>
                <div className={`${styles.blob} ${styles.primaryBlob}`}></div>
                <div className={`${styles.blob} ${styles.secondaryBlob}`}></div>
                <div className={`${styles.blob} ${styles.accentBlob}`}></div>
            </div>

            <section className={styles.pageHeader}>
                <div className="container text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Join Our Mission
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lead-text"
                    >
                        Your time and skills can make a lasting difference in our community. Become a volunteer today and help us build a brighter future for the people of Savannah.
                    </motion.p>
                </div>
            </section>

            <section className={styles.formSection}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <VolunteerForm />
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
