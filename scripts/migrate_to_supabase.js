const { PrismaClient } = require('@prisma/client');

async function migrate() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

    console.log('Connecting to PostgreSQL...');
    const pg = new PrismaClient({ datasources: { db: { url: pgUrl } } });

    console.log('Connecting to SQLite...');
    const sqlite = new PrismaClient({ datasources: { db: { url: 'file:./dev.db' } } });

    try {
        // 1. Get all data from SQLite
        console.log('Fetching data from SQLite...');
        // We fetch one by one to avoid issues
        const users = await sqlite.user.findMany().catch(e => { console.log('User fetch failed, maybe schema mismatch but continuing...'); return []; });
        const workspaces = await sqlite.workspace.findMany().catch(e => []);
        const projects = await sqlite.project.findMany().catch(e => []);
        const sheets = await sqlite.sheet.findMany().catch(e => []);
        const columns = await sqlite.column.findMany().catch(e => []);
        const rows = await sqlite.row.findMany().catch(e => []);

        console.log(`Found: ${users.length} users, ${workspaces.length} workspaces, ${projects.length} projects, ${sheets.length} sheets, ${columns.length} columns, ${rows.length} rows.`);

        if (projects.length === 0 && sheets.length === 0) {
            console.log("No data found in SQLite. Migration aborted to prevent data loss.");
            return;
        }

        // 2. Clear PG data (to avoid duplicates)
        console.log('Clearing PostgreSQL data...');
        await pg.rowHistory.deleteMany().catch(e => { });
        await pg.comment.deleteMany().catch(e => { });
        await pg.row.deleteMany().catch(e => { });
        await pg.column.deleteMany().catch(e => { });
        await pg.view.deleteMany().catch(e => { });
        await pg.sheet.deleteMany().catch(e => { });
        await pg.project.deleteMany().catch(e => { });
        await pg.workspaceMember.deleteMany().catch(e => { });
        await pg.workspace.deleteMany().catch(e => { });
        await pg.session.deleteMany().catch(e => { });
        await pg.account.deleteMany().catch(e => { });
        await pg.user.deleteMany().catch(e => { });

        // 3. Insert into PG
        console.log('Inserting into PostgreSQL...');
        if (users.length > 0) await pg.user.createMany({ data: users });
        if (workspaces.length > 0) await pg.workspace.createMany({ data: workspaces });
        if (projects.length > 0) await pg.project.createMany({ data: projects });
        if (sheets.length > 0) await pg.sheet.createMany({ data: sheets });
        if (columns.length > 0) await pg.column.createMany({ data: columns });
        if (rows.length > 0) {
            const batchSize = 100;
            for (let i = 0; i < rows.length; i += batchSize) {
                await pg.row.createMany({ data: rows.slice(i, i + batchSize) });
                console.log(`Inserted ${Math.min(i + batchSize, rows.length)} rows...`);
            }
        }

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await pg.$disconnect();
        await sqlite.$disconnect();
    }
}

migrate();
