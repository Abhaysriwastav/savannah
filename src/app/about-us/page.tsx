import styles from "./about.module.css";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AboutUs() {
    const settings = await prisma.aboutSettings.findFirst();
    const storyImageUrl = settings?.storyImageUrl;

    return (
        <div className={styles.main}>
            {/* Page Header */}
            <section className={styles.pageHeader}>
                <div className="container text-center animate-fade-in">
                    <h1>About Savannah United Berlin e.V</h1>
                    <p className={styles.subtitle}>Who we are and what we stand for</p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section">
                <div className={`container ${styles.grid}`}>
                    <div className={`${styles.card} glass-panel`}>
                        <h2>Our Mission</h2>
                        <p>
                            To engage in humanitarian aid in Germany (focal point Berlin-Brandenburg)
                            where our members live, and improve the lives of the needy and displaced
                            persons in Nigeria as a result of natural disasters, human negligence,
                            war, and/or terrorism.
                        </p>
                        <p>We try our very best to support HUMANITY in any way possible.</p>
                    </div>
                    <div className={`${styles.card} glass-panel`}>
                        <h2>Our Vision</h2>
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
                            <h2>Our Story</h2>
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
                                    Community Impact
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
