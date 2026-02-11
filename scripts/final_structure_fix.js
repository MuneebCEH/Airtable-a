const { Client } = require('pg');
async function fix() {
    const c = new Client({ connectionString: 'postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres', ssl: { rejectUnauthorized: false } });
    await c.connect();

    // 1. Get Admin ID
    const adminRes = await c.query('SELECT id FROM "User" WHERE email = $1', ['admin@example.com']);
    const adminId = adminRes.rows[0].id;

    // 2. Fix Workspace
    const wsColsRes = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'Workspace'");
    const wsCols = wsColsRes.rows.map(x => x.column_name);
    const wsId = 'ws-manual-fix';
    const wsData = { id: wsId, name: 'Default Workspace' };
    if (wsCols.includes('createdAt')) wsData.createdAt = new Date();
    if (wsCols.includes('updatedAt')) wsData.updatedAt = new Date();

    await c.query(`INSERT INTO "Workspace" (${Object.keys(wsData).map(k => `"${k}"`).join(',')}) VALUES (${Object.keys(wsData).map((_, i) => `$${i + 1}`).join(',')}) ON CONFLICT (id) DO NOTHING`, Object.values(wsData));

    // 3. Fix WorkspaceMember
    const wmColsRes = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'WorkspaceMember'");
    const wmCols = wmColsRes.rows.map(x => x.column_name);
    const mData = { id: 'wm-manual-fix', userId: adminId, workspaceId: wsId, role: 'OWNER' };
    if (wmCols.includes('createdAt')) mData.createdAt = new Date();
    if (wmCols.includes('updatedAt')) mData.updatedAt = new Date();

    await c.query(`INSERT INTO "WorkspaceMember" (${Object.keys(mData).map(k => `"${k}"`).join(',')}) VALUES (${Object.keys(mData).map((_, i) => `$${i + 1}`).join(',')}) ON CONFLICT (id) DO NOTHING`, Object.values(mData));

    // 4. Fix Project
    const pColsRes = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'Project'");
    const pCols = pColsRes.rows.map(x => x.column_name);
    const pData = { id: 'proj-manual-fix', name: 'Medical Records', workspaceId: wsId };
    if (pCols.includes('createdAt')) pData.createdAt = new Date();
    if (pCols.includes('updatedAt')) pData.updatedAt = new Date();

    await c.query(`INSERT INTO "Project" (${Object.keys(pData).map(k => `"${k}"`).join(',')}) VALUES (${Object.keys(pData).map((_, i) => `$${i + 1}`).join(',')}) ON CONFLICT (id) DO NOTHING`, Object.values(pData));

    console.log('ALL BASIC STRUCTURE FIXED!');
    await c.end();
}
fix().catch(console.error);
