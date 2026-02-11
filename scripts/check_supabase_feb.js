const { Client } = require('pg');
async function check() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
    await pg.connect();

    const projectId = 'cmkpqnyil0005uwn8xbqpgtue';
    const res = await pg.query(`
        SELECT s.name as sheet, c.name as column, r.data->>c.id as value
        FROM "Sheet" s
        JOIN "Column" c ON c."sheetId" = s.id
        JOIN "Row" r ON r."sheetId" = s.id
        WHERE s."projectId" = $1 AND (c.name = 'Refill Due' OR c.name = 'Delivered Date')
        AND (r.data->>c.id) LIKE '%/02/2026%' OR (r.data->>c.id) LIKE '02/%/2026%' OR (r.data->>c.id) LIKE '2026-02-%'
        LIMIT 20
    `, [projectId]);

    console.log('--- SUPABASE FEB 2026 DATES ---');
    res.rows.forEach(r => console.log(`${r.sheet} | ${r.column} | Value: [${r.value}]`));
    await pg.end();
}
check();
