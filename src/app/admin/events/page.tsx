import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import styles from "../admin.module.css";
import DeleteEventButton from "./DeleteEventButton";

export default async function AdminEvents() {
    const events = await prisma.event.findMany({
        orderBy: { date: 'asc' }
    });

    return (
        <div>
            <div className={styles.pageHeader}>
                <h1>Manage Events</h1>
                <Link href="/admin/events/new" className="btn btn-primary">
                    <FiPlus /> Add New Event
                </Link>
            </div>

            <div className={styles.adminCard}>
                {events.length === 0 ? (
                    <p>No events found. Click "Add New Event" to create one.</p>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event) => (
                                <tr key={event.id}>
                                    <td>{event.title}</td>
                                    <td>{new Date(event.date).toLocaleDateString()}</td>
                                    <td>{event.location}</td>
                                    <td>
                                        <div className={styles.actionCell}>
                                            <DeleteEventButton id={event.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
