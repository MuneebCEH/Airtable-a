const { Client } = require('pg');
async function check() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
    await pg.connect();

    const res = await pg.query(`
        SELECT s.name as sheet_name, c.name as column_name, count(r.id) as row_count
        FROM "Sheet" s
        JOIN "Column" c ON c."sheetId" = s.id
        LEFT JOIN "Row" r ON r."sheetId" = s.id
        WHERE c.name ILIKE '%Refill Due%' OR c.name ILIKE '%Delivered Date%'
        GROUP BY s.name, c.name
    `);

    console.log(res.rows);
    await pg.end();
}
check();
