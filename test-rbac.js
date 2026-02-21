async function testRBAC() {
    console.log("Starting RBAC Integration Test...");
    try {
        // 1. Superadmin Login
        const loginRes = await fetch('http://localhost:3002/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'password' })
        });

        if (!loginRes.ok) {
            console.log("Superadmin login failed!", await loginRes.text());
            return;
        }
        const adminCookie = loginRes.headers.get('set-cookie');
        console.log("✅ Superadmin Login Successful.");

        // 2. Create Editor User
        const createRes = await fetch('http://localhost:3002/api/admin-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': adminCookie
            },
            body: JSON.stringify({
                username: 'backend_editor',
                password: 'backend_secure123',
                role: 'editor',
                permissions: ['manage_gallery']
            })
        });

        // Handle Already created from previous runs quietly
        if (createRes.ok) {
            console.log("✅ Editor user 'backend_editor' created.");
        } else {
            const resp = await createRes.json();
            if (resp.error === 'Username already exists') {
                console.log("⚠️ Editor user 'backend_editor' already exists. Re-using.");
            } else {
                console.log("❌ Failed to create editor user.", resp);
                return;
            }
        }

        // 3. Editor Login
        const editorLoginRes = await fetch('http://localhost:3002/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'backend_editor', password: 'backend_secure123' })
        });

        if (!editorLoginRes.ok) {
            console.log("❌ Editor login failed.", await editorLoginRes.text());
            return;
        }
        const editorCookie = editorLoginRes.headers.get('set-cookie');
        console.log("✅ Editor Login Successful.");

        // 4. Verify Editor Session (RBAC payload)
        const meRes = await fetch('http://localhost:3002/api/me', {
            method: 'GET',
            headers: { 'Cookie': editorCookie }
        });
        const meData = await meRes.json();
        console.log("✅ Editor /api/me response:", meData);

        if (meData.role === 'editor' && meData.permissions.includes('manage_gallery')) {
            console.log("🏆 RBAC Verification Passed!");
        } else {
            console.log("❌ RBAC Verification Failed: Incorrect permissions/role.");
        }

    } catch (error) {
        console.error("Test failed due to exception:", error);
    }
}

testRBAC();
