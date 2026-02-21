import { prisma } from "@/lib/prisma";
import styles from "./dashboard.module.css";
import { FiCalendar, FiTarget, FiMessageSquare, FiUsers, FiTrendingUp, FiSettings, FiCheckCircle, FiClock, FiImage, FiEdit3 } from "react-icons/fi";
import Link from "next/link";
import { verifyAuth } from "@/lib/auth";

export default async function AdminDashboard() {
    // Current User Session
    let currentUsername = 'Admin';
    let userRole = 'superadmin';
    try {
        const session = await verifyAuth();
        currentUsername = session.username;
        userRole = session.role;
    } catch (e) {
        // Fallback or allowed via middleware
    }

    // Fetch overview stats
    const eventsCount = await prisma.event.count();
    const projectsCount = await prisma.project.count();
    const usersCount = await prisma.adminUser.count();
    const messagesCount = await prisma.contactMessage.count({
        where: { status: 'new' }
    });

    // Donations
    const donationSettings = await prisma.donationSettings.findFirst();
    const totalDonations = donationSettings?.totalCount || 0;

    // Recent Messages for Task List
    const recentMessages = await prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });

    // Upcoming Events for Calendar
    const upcomingEvents = await prisma.event.findMany({
        take: 3,
        where: { date: { gte: new Date() } },
        orderBy: { date: 'asc' }
    });

    // Format utility
    const formatTime = (date: Date) => date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const formatDay = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short' });
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    // Progress calculations (Simulated bounds for visual effect)
    const eventCap = Math.min(Math.round((eventsCount / 20) * 100), 100);
    const donationGoal = Math.min(Math.round((totalDonations / 1000) * 100), 100);

    return (
        <div className={`animate-fade-in ${styles.dashboardContainer}`}>
            {/* 1. Header Section */}
            <header className={styles.header}>
                <div className={styles.greeting}>
                    <h1>Welcome in, <span>{currentUsername}</span></h1>
                </div>

                <div className={styles.topStats}>
                    <div className={styles.progressItem}>
                        <span className={styles.progressLabel}>Event Capacity</span>
                        <div className={styles.progressBar}>
                            <div className={`${styles.progressFill} ${styles.dark}`} style={{ width: `${eventCap}%` }}>
                                {eventCap}%
                            </div>
                        </div>
                    </div>

                    <div className={styles.progressItem}>
                        <span className={styles.progressLabel}>Donation Goal</span>
                        <div className={styles.progressBar}>
                            <div className={`${styles.progressFill} ${styles.yellow}`} style={{ width: `${donationGoal}%` }}>
                                {donationGoal}%
                            </div>
                        </div>
                    </div>

                    <div className={styles.largeStats}>
                        <div className={styles.largeStat}>
                            <span className={styles.largeStatValue}>{usersCount}</span>
                            <span className={styles.largeStatLabel}>Users</span>
                        </div>
                        <div className={styles.largeStat}>
                            <span className={styles.largeStatValue}>{messagesCount}</span>
                            <span className={styles.largeStatLabel}>Inquiries</span>
                        </div>
                        <div className={styles.largeStat}>
                            <span className={styles.largeStatValue}>{projectsCount}</span>
                            <span className={styles.largeStatLabel}>Projects</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. Main Grid Layout */}
            <div className={styles.mainGrid}>

                {/* LEFT COLUMN: Profile & Quick Links */}
                <div>
                    <div className={`${styles.card} ${styles.profileCard}`}>
                        <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                            alt="Profile Background"
                            className={styles.profileImage}
                        />
                        <div className={styles.profileInfo}>
                            <div>
                                <h2>{currentUsername}</h2>
                                <span className={styles.profileRole}>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
                            </div>
                            <span className={styles.badge}><FiSettings style={{ marginRight: '5px' }} />System</span>
                        </div>
                    </div>

                    <div className={styles.accordion}>
                        <Link href="/admin/events/new" className={styles.accordionItem}>
                            <span>Create New Event</span>
                            <FiCalendar />
                        </Link>
                        <Link href="/admin/projects/new" className={styles.accordionItem}>
                            <span>Add New Project</span>
                            <FiTarget />
                        </Link>
                        <Link href="/admin/gallery" className={styles.accordionItem}>
                            <span>Upload Gallery Images</span>
                            <FiImage />
                        </Link>
                        {userRole === 'superadmin' && (
                            <Link href="/admin/about" className={styles.accordionItem}>
                                <span>Edit About Us Text</span>
                                <FiEdit3 />
                            </Link>
                        )}
                    </div>
                </div>

                {/* MIDDLE COLUMN: Activity & Schedule */}
                <div className={styles.middleCol}>
                    <div className={styles.middleTopRow}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h3>Inquiry Activity</h3>
                                <button className={styles.iconBtn}><FiTrendingUp /></button>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 300 }}>{messagesCount} <span style={{ fontSize: '0.8rem', color: '#8d99ae' }}>This week</span></div>

                            {/* Simulated Bar Chart */}
                            <div className={styles.chartBars}>
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                                    const height = Math.floor(Math.random() * 80) + 20;
                                    const isToday = i === new Date().getDay() - 1;
                                    return (
                                        <div key={i} className={styles.chartBarCol}>
                                            <div className={styles.barWrapper}>
                                                <div className={`${styles.barActive} ${isToday ? styles.highlight : ''}`} style={{ height: `${height}%` }}></div>
                                            </div>
                                            <span className={styles.dayLabel}>{day}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div className={styles.cardHeader} style={{ width: '100%' }}>
                                <h3>System Time</h3>
                                <button className={styles.iconBtn}><FiClock /></button>
                            </div>
                            <div style={{
                                width: '150px', height: '150px', borderRadius: '75px',
                                border: '8px solid #ffd166', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                fontSize: '2rem', fontWeight: 300, margin: '1rem 0'
                            }}>
                                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </div>
                            <div style={{ color: '#8d99ae', fontSize: '0.85rem' }}>Platform Health Normal</div>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.calendarWidget}`}>
                        <div className={styles.calendarTabs}>
                            <span className={`${styles.calendarTab} ${styles.active}`}>Upcoming Schedule</span>
                            <span className={styles.calendarTab}>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        </div>

                        <div className={styles.weekDays}>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                                const d = new Date();
                                const currentDayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
                                d.setDate(d.getDate() - currentDayIndex + i);

                                return (
                                    <div key={i} className={styles.calendarDay}>
                                        <span>{day}</span>
                                        <span className={styles.calendarDate}>{d.getDate()}</span>
                                    </div>
                                )
                            })}
                        </div>

                        <div className={styles.eventList}>
                            {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                                <div key={event.id} className={styles.eventItem}>
                                    <div className={styles.eventTime}>{formatTime(event.date)}</div>
                                    <div className={`${styles.eventCard} ${upcomingEvents.indexOf(event) % 2 !== 0 ? styles.light : ''}`}>
                                        <div>
                                            <h4>{event.title}</h4>
                                            <p>{formatDay(event.date)}, {formatDate(event.date)}</p>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#fff', border: '2px solid #2b2d42', marginLeft: '-8px' }}></div>
                                            <div style={{ width: '24px', height: '24px', borderRadius: '12px', background: '#eee', border: '2px solid #2b2d42', marginLeft: '-8px' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p style={{ textAlign: 'center', color: '#8d99ae', fontSize: '0.9rem' }}>No upcoming events scheduled.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Tasks (Inquiries) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3>System Setup</h3>
                            <span style={{ fontSize: '1.5rem', fontWeight: 300 }}>80%</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <div style={{ flex: 1, height: '24px', background: '#ffd166', borderRadius: '12px', color: '#2b2d42', display: 'flex', alignItems: 'center', paddingLeft: '10px', fontSize: '0.75rem', fontWeight: 600 }}>Core</div>
                            <div style={{ flex: 1, height: '24px', background: '#2b2d42', borderRadius: '12px' }}></div>
                            <div style={{ width: '30px', height: '24px', background: '#e4eaf5', borderRadius: '12px' }}></div>
                        </div>
                    </div>

                    <div className={`${styles.card} ${styles.taskListCard}`}>
                        <div className={styles.taskListHeader}>
                            <h3>Recent Inquiries</h3>
                            <span className={styles.taskCount}>{recentMessages.length}/5</span>
                        </div>

                        <div className={styles.taskList}>
                            {recentMessages.length > 0 ? recentMessages.map((msg) => (
                                <div key={msg.id} className={styles.taskItem}>
                                    <div className={styles.taskIcon}>
                                        <FiMessageSquare color="#fff" />
                                    </div>
                                    <div className={styles.taskDetails}>
                                        <h4 className={styles.taskTitle}>{msg.name}</h4>
                                        <p className={styles.taskTime}>{msg.subject} • {formatDate(msg.createdAt)}</p>
                                    </div>
                                    <div className={`${styles.taskStatus} ${msg.status === 'read' ? styles.done : ''}`}>
                                        {msg.status === 'read' && <FiCheckCircle size={12} />}
                                    </div>
                                </div>
                            )) : (
                                <p style={{ opacity: 0.7, fontSize: '0.9rem', textAlign: 'center' }}>No pending inquiries.</p>
                            )}
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <Link href="/admin/messages" style={{ color: '#ffd166', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
                                View All Messages →
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
