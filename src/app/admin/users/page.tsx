'use client';

import { useState, useEffect } from 'react';
import styles from './adminUsers.module.css';
import { FiTrash2, FiEdit2, FiPlus, FiSave, FiX } from 'react-icons/fi';

interface AdminUser {
    id: string;
    username: string;
    role: string;
    permissions: string[];
    createdAt: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form States
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'editor',
        permissions: [] as string[]
    });

    const AVAILABLE_PERMISSIONS = [
        { id: 'manage_events', label: 'Manage Events' },
        { id: 'manage_projects', label: 'Manage Projects' },
        { id: 'manage_gallery', label: 'Manage Gallery' },
        { id: 'manage_impact', label: 'Manage Impact Metrics' },
        { id: 'manage_messages', label: 'Manage Messages' },
        { id: 'manage_donations', label: 'Manage Donations Settings' },
        { id: 'manage_volunteers', label: 'Manage Volunteers' },
        { id: 'manage_testimonials', label: 'Manage Testimonials' },
        { id: 'manage_partners', label: 'Manage Partners' }
    ];

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin-users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                setMessage({ type: 'error', text: 'Unauthorized or failed to load users.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error fetching users.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePermissionToggle = (permission: string) => {
        setFormData(prev => {
            const isSelected = prev.permissions.includes(permission);
            return {
                ...prev,
                permissions: isSelected
                    ? prev.permissions.filter(p => p !== permission)
                    : [...prev.permissions, permission]
            };
        });
    };

    const handleEdit = (user: AdminUser) => {
        setFormData({
            username: user.username,
            password: '', // Blank password implies no change
            role: user.role,
            permissions: user.permissions || []
        });
        setEditingId(user.id);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setFormData({ username: '', password: '', role: 'editor', permissions: [] });
        setEditingId(null);
        setIsEditing(false);
        setMessage({ type: '', text: '' });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const url = '/api/admin-users';
            const method = editingId ? 'PUT' : 'POST';

            const payload = editingId ? { ...formData, id: editingId } : formData;

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: `User ${editingId ? 'updated' : 'created'} successfully!` });
                fetchUsers();
                handleCancelEdit(); // Reset form
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save.' });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: `An error occurred: ${error.message}` });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

        try {
            const res = await fetch(`/api/admin-users?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage({ type: 'success', text: 'User deleted successfully.' });
                fetchUsers();
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Failed to delete user.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error deleting user.' });
        }
    };

    if (isLoading) return <div className={styles.loading}>Loading users...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>User Management</h1>
                    <p className={styles.subtitle}>Create and manage admin and editor accounts.</p>
                </div>
                {!isEditing && (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                        <FiPlus /> Add New User
                    </button>
                )}
            </header>

            {message.text && (
                <div className={`${styles.alert} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            {isEditing && (
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2>{editingId ? 'Edit User' : 'Create New User'}</h2>
                    </div>
                    <div className={styles.cardBody}>
                        <form onSubmit={handleSave} className={styles.form}>

                            <div className={styles.formGroup}>
                                <label>Username *</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., john_editor"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>{editingId ? 'New Password (leave blank to keep current)' : 'Password *'}</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={!editingId}
                                    placeholder="Enter secure password"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className={styles.select}
                                >
                                    <option value="editor">Editor (Restricted Access)</option>
                                    <option value="superadmin">Superadmin (Full Access)</option>
                                </select>
                            </div>

                            {formData.role === 'editor' && (
                                <div className={styles.formGroup}>
                                    <label>Editor Permissions</label>
                                    <p className={styles.hint}>Select which specific areas this editor can manage.</p>
                                    <div className={styles.checkboxGrid}>
                                        {AVAILABLE_PERMISSIONS.map(perm => (
                                            <label key={perm.id} className={styles.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.permissions.includes(perm.id)}
                                                    onChange={() => handlePermissionToggle(perm.id)}
                                                />
                                                {perm.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.actions}>
                                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                                    <FiSave /> {isSaving ? 'Saving...' : 'Save User'}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>
                                    <FiX /> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Permissions</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className={styles.titleCell}>{user.username}</td>
                                <td>
                                    <span className={`${styles.badge} ${user.role === 'superadmin' ? styles.superadmin : styles.editor}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>
                                    {user.role === 'superadmin' ? (
                                        <span className={styles.allAccess}>All Access</span>
                                    ) : (
                                        <div className={styles.permissionTags}>
                                            {user.permissions.length > 0 ? user.permissions.map(p => (
                                                <span key={p} className={styles.permissionTag}>{p.replace('manage_', '')}</span>
                                            )) : <span className={styles.noAccess}>No Access</span>}
                                        </div>
                                    )}
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className={styles.actionCell}>
                                    <button
                                        className={styles.iconBtn}
                                        onClick={() => handleEdit(user)}
                                        title="Edit User"
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        className={`${styles.iconBtn} ${styles.danger}`}
                                        onClick={() => handleDelete(user.id)}
                                        title="Delete User"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className={styles.emptyState}>No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
