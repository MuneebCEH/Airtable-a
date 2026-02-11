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
        WHERE s."projectId" = $1 AND s.name = 'BRX PTs'
        AND (r.data->>(SELECT id FROM "Column" WHERE name = 'Refill Due' AND "sheetId" = s.id)) IS NOT NULL
        LIMIT 1
    `, [projectId]);

    if (res.rows.length > 0) {
        const row = res.rows[0];
        const data = row.data;
        const cols = await pg.query('SELECT id, name FROM "Column" WHERE "sheetId" = (SELECT id FROM "Sheet" WHERE name = \'BRX PTs\' AND "projectId" = $1)', [projectId]);
        const colMap = {};
        cols.rows.forEach(c => colMap[c.id] = c.name);
        for (const key in data) {
            console.log(`${colMap[key] || key}: ${data[key]}`);
        }
    } else {
        console.log('No data found with Refill Due in BRX PTs');
    }
    await pg.end();
}
check();
