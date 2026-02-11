const { Client } = require('pg');
async function check() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
    await pg.connect();

    const projectId = 'cmkpqnyil0005uwn8xbqpgtue';
    const res = await pg.query(`
        SELECT s.name as s, c.name as c, count(r.id) as count
        FROM "Sheet" s
        JOIN "Column" c ON c."sheetId" = s.id
        LEFT JOIN "Row" r ON r."sheetId" = s.id AND (r.data->>c.id) IS NOT NULL AND (r.data->>c.id) != ''
        WHERE s."projectId" = $1 AND (c.name ILIKE '%Refill%' OR c.name ILIKE '%Delivered%')
        GROUP BY s.name, c.name
        ORDER BY s.name
    `, [projectId]);

    res.rows.forEach(r => console.log(`${r.s} | ${r.c} | ${r.count}`));
    await pg.end();
}
check();
