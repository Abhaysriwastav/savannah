'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './adminProjects.module.css';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface Project {
    id: string;
    title: string;
    description: string;
    imageUrl: string | null;
    createdAt: string;
}

export default function AdminProjectsList() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete the project "${title}"?`)) return;

        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProjects(projects.filter(p => p.id !== id));
            } else {
                alert("Failed to delete project");
            }
        } catch (error) {
            console.error("Error deleting project", error);
            alert("Error deleting project");
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Manage Projects</h1>
                    <p className={styles.subtitle}>Create, edit, and reorganize your organization's projects.</p>
                </div>
                <Link href="/admin/projects/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiPlus /> Add New Project
                </Link>
            </header>

            {isLoading ? (
                <div className={styles.loading}>Loading projects...</div>
            ) : projects.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No projects found. Create your first project to display it on the website.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Date Created</th>
                                <th>Image cover</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td className={styles.tdTitle}>
                                        <strong>{project.title}</strong>
                                        <div className={styles.descriptionTrim}>{project.description}</div>
                                    </td>
                                    <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {project.imageUrl ? <span className={styles.tagSuccess}>Yes</span> : <span className={styles.tagWarning}>No</span>}
                                    </td>
                                    <td className={styles.actions}>
                                        <Link href={`/admin/projects/${project.id}`} className={styles.btnIcon}>
                                            <FiEdit2 />
                                        </Link>
                                        <button onClick={() => handleDelete(project.id, project.title)} className={`${styles.btnIcon} ${styles.btnDelete}`}>
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
