const { Client } = require('pg');
async function check() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const pg = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });
    await pg.connect();

    const res = await pg.query(`
        SELECT s.name as sheet_name, c.name as column_name, c.id as column_id
        FROM "Sheet" s
        JOIN "Column" c ON c."sheetId" = s.id
        WHERE c.name ILIKE '%Refill%' OR c.name ILIKE '%Delivered%'
    `);

    console.log(JSON.stringify(res.rows, null, 2));
    await pg.end();
}
check();
