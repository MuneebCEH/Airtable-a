const { Client } = require('pg');
async function check() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
    await pg.connect();

    const projectId = 'cmkpqnyil0005uwn8xbqpgtue';
    const res = await pg.query(`
        SELECT c.name
        FROM "Column" c
        JOIN "Sheet" s ON c."sheetId" = s.id
        WHERE s.name = 'Patients' AND s."projectId" = $1
        ORDER BY c.order
    `, [projectId]);

    res.rows.forEach(r => console.log(r.name));
    await pg.end();
}
check();
