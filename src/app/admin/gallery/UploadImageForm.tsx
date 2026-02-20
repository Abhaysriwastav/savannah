'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FiUpload } from 'react-icons/fi';

export default function UploadImageForm() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) {
            alert("Please select at least one image");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        files.forEach((file) => {
            formData.append('images', file);
        });

        if (title) {
            formData.append('title', title);
        }

        try {
            const res = await fetch('/api/upload?type=gallery', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                setFiles([]);
                setTitle('');
                if (fileInputRef.current) fileInputRef.current.value = '';
                router.refresh(); // Refresh gallery
            } else {
                const data = await res.json();
                alert(`Failed to upload images: ${data.details || data.error || 'Unknown error'}`);
            }
        } catch (err: any) {
            alert(`Error uploading images: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="title">Image Title (Optional)</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Education Outreach 2023"
                    style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label htmlFor="image">Select Image</label>
                <div style={{ border: '1px dashed var(--primary)', padding: '2rem', textAlign: 'center', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'rgba(224, 122, 95, 0.05)' }}>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        required
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="image" style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <FiUpload size={24} />
                        {files.length > 0 ? `${files.length} image(s) selected` : 'Click to select images'}
                    </label>
                </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading || files.length === 0} style={{ marginTop: '0.5rem' }}>
                {loading ? 'Uploading...' : 'Upload Images'}
            </button>
        </form>
    );
}
