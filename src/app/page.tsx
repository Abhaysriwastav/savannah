import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { FiHeart, FiUsers, FiBookOpen, FiCalendar, FiMapPin } from "react-icons/fi";
import { prisma } from "@/lib/prisma";
import GalleryCarousel from "@/components/GalleryCarousel";
import HeroSlider from "@/components/HeroSlider";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    take: 3, // Only show top 3 upcoming events on home page
  });

  const galleryImages = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6, // Show the 6 most recent gallery images in carousel
  });

  const latestProject = await prisma.project.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <HeroSlider />
        </div>

        <div className={`container ${styles.heroContent} animate-fade-in`}>
          <div className={styles.heroText}>
            <div className={styles.welcomeSubtitle}>
              <span>Welcome to Savannah United Berlin</span>
            </div>
            <h1>Empowering Communities in Need</h1>
            <p>
              Savannah United Berlin e.V is a nonprofit organization driven by the passion
              for Socio-economic integration and Humanitarian aid to those who need it most.
            </p>
            <div className={styles.heroActions}>
              <Link href="/donations" className="btn btn-primary">
                Make a Donation
              </Link>
              <Link href="/about-us" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>
                Learn More
              </Link>
            </div>
          </div>

          <div className={`${styles.statsCards} glass-panel`}>
            <div className={styles.stat}>
              <FiHeart size={32} color="var(--primary)" />
              <h3>Humanitarian Aid</h3>
              <p>Supporting the needy globally.</p>
            </div>
            <div className={styles.stat}>
              <FiUsers size={32} color="var(--primary)" />
              <h3>Integration</h3>
              <p>Fostering unity in diversity.</p>
            </div>
            <div className={styles.stat}>
              <FiBookOpen size={32} color="var(--primary)" />
              <h3>Education</h3>
              <p>Equipping students for the future.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Project Section */}
      {latestProject && (
        <section className={`section ${styles.projectSection}`}>
          <div className="container">
            <div className={styles.projectGrid}>
              <div className={styles.projectImage}>
                {latestProject.imageUrl ? (
                  <img
                    src={latestProject.imageUrl}
                    alt={latestProject.title}
                    className={styles.dynamicProjectImage}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    {latestProject.title}
                  </div>
                )}
              </div>
              <div className={styles.projectInfo}>
                <span className={styles.tag}>Latest Project</span>
                <h2>{latestProject.title}</h2>
                <p>{latestProject.description}</p>
                <ul className={styles.projectFeatures}>
                  {latestProject.bullet1 && <li>{latestProject.bullet1}</li>}
                  {latestProject.bullet2 && <li>{latestProject.bullet2}</li>}
                  {latestProject.bullet3 && <li>{latestProject.bullet3}</li>}
                </ul>
                <Link href="/projects" className="btn btn-primary">
                  View All Projects
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Carousel Section */}
      <GalleryCarousel images={galleryImages} />

      {/* Upcoming Events Section */}
      <section className={`section ${styles.projectSection}`}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
            <h2>Upcoming Events</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Join us in our upcoming community events and outreach programs.</p>
          </div>

          <div className={styles.homeEventsGrid}>
            {events.length === 0 ? (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-secondary)' }}>No upcoming events scheduled at the moment.</p>
            ) : (
              events.map((event: typeof events[0]) => (
                <Link href={`/events/${event.id}`} key={event.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className={`${styles.homeEventCard} glass-panel`}>
                    <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: 'var(--border)' }}>
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', backgroundColor: 'rgba(0,0,0,0.05)' }}>No Image</div>
                      )}
                    </div>
                    <div style={{ padding: 'var(--spacing-lg)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h3 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--text-primary)' }}>{event.title}</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: 'var(--spacing-md)', paddingBottom: 'var(--spacing-sm)', borderBottom: '1px solid var(--border)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiCalendar color="var(--primary)" /> {new Date(event.date).toLocaleDateString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FiMapPin color="var(--primary)" /> {event.location}</span>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{event.description}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/events" className="btn btn-outline">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container text-center">
          <h2>How Can You Help Us?</h2>
          <p>Join us today and start making a real difference in people's lives.</p>
          <div className={styles.ctaGrid}>
            <div className={`${styles.ctaCard} glass-panel`}>
              <h3>Donate</h3>
              <p>Your contribution helps us fund critical projects.</p>
              <Link href="/donations" className="btn btn-primary">Donate Now</Link>
            </div>
            <div className={`${styles.ctaCard} glass-panel`}>
              <h3>Volunteer</h3>
              <p>Give your time and skills for a good cause.</p>
              <Link href="/contact" className="btn btn-outline">Join Us</Link>
            </div>
            <div className={`${styles.ctaCard} glass-panel`}>
              <h3>Scholarship</h3>
              <p>Help a child access quality education.</p>
              <Link href="/contact" className="btn btn-outline">Give Scholarship</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
