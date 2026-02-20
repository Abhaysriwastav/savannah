'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiTrash2 } from 'react-icons/fi';

export default function DeleteEventButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                router.refresh();
            } else {
                const data = await res.json();
                alert(`Failed to delete event: ${data.details || data.error || 'Unknown error'}`);
            }
        } catch (err: any) {
            alert(`Error deleting event: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.8rem', borderColor: 'var(--error)', color: 'var(--error)' }}
            disabled={loading}
            aria-label="Delete event"
        >
            <FiTrash2 />
        </button>
    );
}
