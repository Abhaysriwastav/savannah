import { cookies } from 'next/headers';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-savannah-123';
const secret = new TextEncoder().encode(JWT_SECRET);

export interface AdminPayload {
    id: string;
    username: string;
    role: string;
    permissions: string[];
}

/**
 * Validates the admin session against required permissions.
 * If the user is a superadmin, access is always granted.
 * Otherwise, checks if the user's permissions array includes the required permission.
 * 
 * @param requiredPermission e.g., 'manage_events', 'manage_projects'
 * @throws Error if unauthorized or lacking permissions
 * @returns The parsed payload
 */
export async function verifyAuth(requiredPermission?: string): Promise<AdminPayload> {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session')?.value;

    if (!token) throw new Error('Unauthorized');

    try {
        const { payload } = await jose.jwtVerify(token, secret);
        const adminPayload = payload as unknown as AdminPayload;

        if (adminPayload.role === 'superadmin') {
            return adminPayload;
        }

        if (requiredPermission && (!adminPayload.permissions || !adminPayload.permissions.includes(requiredPermission))) {
            throw new Error(`Forbidden: Requires ${requiredPermission} access`);
        }

        return adminPayload;
    } catch (error) {
        throw new Error('Unauthorized');
    }
}
