const { Client } = require('pg');
async function check() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
    await pg.connect();

    const projectId = 'cmkpqnyil0005uwn8xbqpgtue';
    const res = await pg.query(`
        SELECT r.data, r.id
        FROM "Row" r
        JOIN "Sheet" s ON r."sheetId" = s.id
        WHERE s."projectId" = $1 AND s.name = 'Patients'
        LIMIT 1
    `, [projectId]);

    if (res.rows.length > 0) {
        const row = res.rows[0];
        console.log('Row ID:', row.id);
        const data = row.data;
        // Also fetch column names to map keys
        const cols = await pg.query('SELECT id, name FROM "Column" WHERE "sheetId" = (SELECT id FROM "Sheet" WHERE name = \'Patients\' AND "projectId" = $1)', [projectId]);
        const colMap = {};
        cols.rows.forEach(c => colMap[c.id] = c.name);

        for (const key in data) {
            console.log(`${colMap[key] || key}: ${data[key]}`);
        }
    }
    await pg.end();
}
check();
