const { Client } = require('pg');
async function check() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
    await pg.connect();

    const projectId = 'cmkpqnyil0005uwn8xbqpgtue';
    const res = await pg.query(`
        SELECT s.name as s, c.name as c
        FROM "Column" c
        JOIN "Sheet" s ON c."sheetId" = s.id
        WHERE s."projectId" = $1 AND s.name IN ('CGM PTS', 'BRX PTs')
        ORDER BY s.name, c.order
    `, [projectId]);

    res.rows.forEach(r => console.log(`${r.s} | ${r.c}`));
    await pg.end();
}
check();
