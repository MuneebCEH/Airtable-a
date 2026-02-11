const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');

async function migrate() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const sqlite = new PrismaClient({ datasources: { db: { url: 'file:C:/Users/FBC/Downloads/airtable/prisma/dev.db' } } });
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });

    try {
        await pg.connect();
        console.log('Connected.');

        async function insertDynamic(table, data) {
            const colsRes = await pg.query("SELECT column_name FROM information_schema.columns WHERE table_name = $1", [table]);
            const dbCols = colsRes.rows.map(r => r.column_name);
            const filteredData = {};
            for (const key in data) {
                if (dbCols.includes(key)) filteredData[key] = data[key];
                else if (key === 'createdAt' && dbCols.includes('created_at')) filteredData['created_at'] = data[key];
                else if (key === 'updatedAt' && dbCols.includes('updated_at')) filteredData['updated_at'] = data[key];
            }
            const keys = Object.keys(filteredData);
            const query = `INSERT INTO "${table}" (${keys.map(k => `"${k}"`).join(',')}) VALUES (${keys.map((_, i) => `$${i + 1}`).join(',')}) ON CONFLICT (id) DO NOTHING`;
            await pg.query(query, Object.values(filteredData));
        }

        // THE TARGET PROJECT WITH DATA
        const projectId = 'cmkpqnyil0005uwn8xbqpgtue';
        const project = await sqlite.project.findUnique({
            where: { id: projectId },
            include: { workspace: true, sheets: { include: { columns: true, rows: true } } }
        });

        if (!project) return console.log('Project not found');

        console.log(`Wiping Supabase (Preparing for ${project.name} migration)...`);
        const tables = ['Comment', 'RowHistory', 'Row', 'View', 'Column', 'Sheet', 'Project', 'WorkspaceMember', 'Workspace'];
        for (const t of tables) {
            await pg.query(`DELETE FROM "${t}"`).catch(() => { });
        }

        console.log('Phase 1: Workspace');
        await insertDynamic('Workspace', project.workspace);

        console.log('Phase 2: Project');
        // We will keep the ID cmkpqnyil0005uwn8xbqpgtue but also can add the other one to be safe if they want both? 
        // No, they said "bs aik".
        await insertDynamic('Project', {
            id: project.id,
            name: project.name,
            description: project.description,
            workspaceId: project.workspaceId,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt
        });

        console.log('Phase 3: Sheets & Data');
        for (const s of project.sheets) {
            console.log(`  Migrating ${s.name} (${s.rows.length} rows)`);
            await insertDynamic('Sheet', s);
            for (const c of s.columns) {
                await insertDynamic('Column', { ...c, options: c.options ? JSON.stringify(c.options) : null });
            }

            // Chunked rows
            const bSize = 50;
            for (let i = 0; i < s.rows.length; i += bSize) {
                const batch = s.rows.slice(i, i + bSize);
                for (const r of batch) {
                    await insertDynamic('Row', { ...r, data: JSON.stringify(r.data) });
                }
                console.log(`    ... ${Math.min(i + bSize, s.rows.length)} rows.`);
            }
        }

        // Link Admin
        const adminRes = await pg.query('SELECT id FROM "User" WHERE email = $1', ['admin@example.com']);
        if (adminRes.rows.length > 0) {
            await pg.query('INSERT INTO "WorkspaceMember" (id, "userId", "workspaceId", role, "updatedAt") VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT DO NOTHING',
                ['wm-link-' + Date.now(), adminRes.rows[0].id, project.workspaceId, 'OWNER']);
        }

        console.log('*** COMPLETE MIGRATION OF DATA PROJECT FINISHED! ***');
    } catch (e) {
        console.error('Fatal Error:', e);
    } finally {
        await pg.end();
        await sqlite.$disconnect();
    }
}
migrate();
