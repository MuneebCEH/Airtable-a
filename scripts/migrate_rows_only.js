const { PrismaClient } = require('@prisma/client');
const { Client } = require('pg');

async function migrateRows() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const sqlite = new PrismaClient({ datasources: { db: { url: 'file:./dev.db' } } });
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });

    try {
        await pg.connect();
        console.log('Connected to PG.');

        const projectId = 'cmlbjpkg00005uw4sdq56abj3';
        const project = await sqlite.project.findUnique({
            where: { id: projectId },
            include: { sheets: { include: { rows: true } } }
        });

        console.log(`Starting Row Migration for ${project.sheets.length} sheets...`);

        for (const s of project.sheets) {
            console.log(`  Processing ${s.name}: ${s.rows.length} rows...`);
            if (s.rows.length === 0) continue;

            // Check row table columns
            const colsRes = await pg.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'Row'");
            const dbCols = colsRes.rows.map(r => r.column_name);

            const batchSize = 100;
            for (let i = 0; i < s.rows.length; i += batchSize) {
                const batch = s.rows.slice(i, i + batchSize);
                for (const r of batch) {
                    const data = {
                        id: r.id,
                        sheetId: r.sheetId,
                        data: JSON.stringify(r.data),
                        order: r.order
                    };
                    if (dbCols.includes('createdAt')) data.createdAt = r.createdAt;
                    if (dbCols.includes('updatedAt')) data.updatedAt = r.updatedAt;
                    if (dbCols.includes('lastModifiedById')) data.lastModifiedById = r.lastModifiedById;

                    const keys = Object.keys(data);
                    const query = `INSERT INTO "Row" (${keys.map(k => `"${k}"`).join(',')}) VALUES (${keys.map((_, u) => `$${u + 1}`).join(',')}) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`;
                    await pg.query(query, Object.values(data));
                }
                console.log(`    Migrated ${Math.min(i + batchSize, s.rows.length)} rows.`);
            }
        }
        console.log('ROW MIGRATION FINISHED!');
    } catch (e) {
        console.error(e);
    } finally {
        await pg.end();
        await sqlite.$disconnect();
    }
}
migrateRows();
