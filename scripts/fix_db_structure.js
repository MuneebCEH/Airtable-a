const { Client } = require('pg');

async function fixDatabase() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const client = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        console.log('Connected.');

        // 1. Create Workspace if missing
        const wsRes = await client.query('SELECT id FROM "Workspace" LIMIT 1');
        let workspaceId;
        if (wsRes.rows.length === 0) {
            console.log('Creating Workspace...');
            workspaceId = 'ws-default-123';
            await client.query('INSERT INTO "Workspace" (id, name, "updatedAt") VALUES ($1, $2, NOW())', [workspaceId, 'Default Workspace']);
        } else {
            workspaceId = wsRes.rows[0].id;
        }

        // 2. Link Admin to Workspace
        const adminRes = await client.query('SELECT id FROM "User" WHERE email = $1', ['admin@example.com']);
        const adminId = adminRes.rows[0].id;
        await client.query('INSERT INTO "WorkspaceMember" (id, "userId", "workspaceId", role, "updatedAt") VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT DO NOTHING',
            ['wm-123', adminId, workspaceId, 'OWNER']);

        // 3. Create Project if missing
        const projRes = await client.query('SELECT id FROM "Project" LIMIT 1');
        if (projRes.rows.length === 0) {
            console.log('Creating Project...');
            await client.query('INSERT INTO "Project" (id, name, "workspaceId", "updatedAt") VALUES ($1, $2, $3, NOW())', ['proj-medical-123', 'Medical Records', workspaceId]);
        }

        console.log('DATABASE STRUCTURE FIXED!');
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

fixDatabase();
