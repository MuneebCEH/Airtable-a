const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');

async function migrate() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const sqlite = new PrismaClient({ datasources: { db: { url: 'file:./dev.db' } } });

    try {
        const projects = await sqlite.project.findMany({
            include: { sheets: { include: { columns: true, rows: true } } }
        });
        const workspaces = await sqlite.workspace.findMany();
        const users = await sqlite.user.findMany();

        console.log(`Found ${projects.length} projects.`);

        const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
        await pg.connect();
        console.log('PG Connected.');

        // Workspaces
        for (const w of workspaces) {
            await pg.query('INSERT INTO "Workspace" (id, name, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING', [w.id, w.name, w.createdAt, w.updatedAt]);
        }
        // Users
        for (const u of users) {
            await pg.query('INSERT INTO "User" (id, name, email, password, image, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING',
                [u.id, u.name, u.email, u.password, u.image, u.role, u.createdAt, u.updatedAt]);
        }

        for (const p of projects) {
            console.log(`Migrating Project: ${p.name}`);
            await pg.query('INSERT INTO "Project" (id, name, description, "workspaceId", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING', [p.id, p.name, p.description, p.workspaceId, p.createdAt, p.updatedAt]);
            for (const s of p.sheets) {
                console.log(`  Sheet: ${s.name} (${s.rows.length} rows)`);
                await pg.query('INSERT INTO "Sheet" (id, name, "projectId", "order", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING', [s.id, s.name, s.projectId, s.order, s.createdAt, s.updatedAt]);
                for (const c of s.columns) {
                    await pg.query('INSERT INTO "Column" (id, "sheetId", name, type, options, "order", width) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING', [c.id, c.sheetId, c.name, c.type, JSON.stringify(c.options), c.order, c.width]);
                }
                // Batch rows
                const batchSize = 10;
                for (let i = 0; i < s.rows.length; i += batchSize) {
                    const batch = s.rows.slice(i, i + batchSize);
                    for (const r of batch) {
                        await pg.query('INSERT INTO "Row" (id, "sheetId", data, "order", "createdAt", "updatedAt", "lastModifiedById") VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING',
                            [r.id, r.sheetId, JSON.stringify(r.data), r.order, r.createdAt, r.updatedAt, r.lastModifiedById]).catch(e => console.log(`Row ${r.id} insert failed: ${e.message}`));
                    }
                    console.log(`    Inserted ${Math.min(i + batchSize, s.rows.length)} rows...`);
                }
            }
        }

        console.log('*** MIGRATION SUCCESSFUL ***');
        await pg.end();
    } catch (err) {
        console.error('Fatal Migration Error:', err);
    } finally {
        await sqlite.$disconnect();
    }
}

migrate();
