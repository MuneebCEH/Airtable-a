const { Client } = require('pg');
async function test() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
    await pg.connect();

    const projectId = 'cmkpqnyil0005uwn8xbqpgtue';

    const res = await pg.query(`
        SELECT s.name as sheet_name, c.name as col_name, c.id as col_id, r.data
        FROM "Sheet" s
        JOIN "Column" c ON c."sheetId" = s.id
        JOIN "Row" r ON r."sheetId" = s.id
        WHERE s."projectId" = $1 
        AND (c.name = 'Refill Due' OR c.name = 'Delivered Date')
        AND (r.data->>c.id) IS NOT NULL AND (r.data->>c.id) != ''
    `, [projectId]);

    console.log(`Total Live Events Found: ${res.rows.length}`);
    if (res.rows.length > 0) {
        const first = res.rows[0];
        console.log(`Sample: Sheet=${first.sheet_name}, Col=${first.col_name}, Date=${first.data[first.col_id]}`);
    }
    await pg.end();
}
test();
