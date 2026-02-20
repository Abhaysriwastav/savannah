'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DeleteImageButton from './DeleteImageButton';
import { FiTrash2 } from 'react-icons/fi';
import styles from '../admin.module.css';

interface GalleryImage {
    id: string;
    url: string;
    title: string | null;
}

export default function GalleryManager({ initialImages }: { initialImages: GalleryImage[] }) {
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleSelect = (id: string) => {
        setSelectedImages((prev) =>
            prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete exactly ${selectedImages.length} images? This cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);

        try {
            const res = await fetch('/api/gallery/bulk-delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imageIds: selectedImages }),
            });

            if (res.ok) {
                setSelectedImages([]);
                router.refresh();
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('A network error occurred while bulk deleting.');
        } finally {
            setIsDeleting(false);
        }
    };

    if (initialImages.length === 0) {
        return <p>No images uploaded yet.</p>;
    }

    return (
        <div style={{ position: 'relative' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {initialImages.map((image) => {
                    const isSelected = selectedImages.includes(image.id);
                    return (
                        <div key={image.id} className={`${styles.galleryCard} ${isSelected ? styles.selectedCard : ''}`} onClick={() => handleSelect(image.id)}>

                            <div className={styles.checkboxOverlay}>
                                <input
                                    type="checkbox"
                                    className={styles.imageCheckbox}
                                    checked={isSelected}
                                    onChange={() => { }} // Controlled by parent div onClick
                                />
                            </div>

                            <img
                                src={image.url}
                                alt={image.title || 'Gallery image'}
                                className={styles.galleryImage}
                            />

                            <div className={styles.galleryCardFooter} onClick={(e) => e.stopPropagation()}>
                                <span className={styles.galleryTitle} title={image.title || 'Untitled'}>
                                    {image.title ? (image.title.length > 15 ? image.title.substring(0, 15) + '...' : image.title) : 'Untitled'}
                                </span>
                                <DeleteImageButton id={image.id} url={image.url} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Floating Bulk Action Bar */}
            {selectedImages.length > 0 && (
                <div className={styles.bulkActionBarWrapper}>
                    <div className={styles.bulkActionBar}>
                        <span><strong>{selectedImages.length}</strong> {selectedImages.length === 1 ? 'image' : 'images'} selected</span>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', borderColor: 'transparent' }} onClick={() => setSelectedImages([])}>Cancel</button>
                            <button className="btn" style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }} onClick={handleBulkDelete} disabled={isDeleting}>
                                <FiTrash2 /> {isDeleting ? 'Deleting...' : 'Delete Selected'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
