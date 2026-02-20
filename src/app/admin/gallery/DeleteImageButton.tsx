'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiTrash2 } from 'react-icons/fi';

export default function DeleteImageButton({ id, url }: { id: string, url: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/gallery/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }), // Send URL to delete the file from the filesystem if needed
            });
            if (res.ok) {
                router.refresh();
            } else {
                alert('Failed to delete image');
            }
        } catch (err) {
            alert('Error deleting image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            style={{
                background: 'none',
                border: 'none',
                color: 'var(--error)',
                cursor: 'pointer',
                padding: '0.25rem'
            }}
            disabled={loading}
            aria-label="Delete image"
        >
            <FiTrash2 size={18} />
        </button>
    );
}
