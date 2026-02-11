const { Client } = require('pg');
async function d() {
    const c = new Client({ connectionString: 'postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres', ssl: { rejectUnauthorized: false } });
    await c.connect();
    const r = await c.query('SELECT * FROM "Row" LIMIT 5');
    console.log('Rows found:', r.rows);
    const count = await c.query('SELECT count(*) FROM "Row"');
    console.log('Count:', count.rows[0]);
    await c.end();
}
d();
