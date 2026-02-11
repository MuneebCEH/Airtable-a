const { Client } = require('pg');
async function d() {
    const c = new Client({ connectionString: 'postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres', ssl: { rejectUnauthorized: false } });
    await c.connect();
    const r = await c.query("SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position");
    r.rows.forEach(row => console.log(`${row.table_name}: ${row.column_name}`));
    await c.end();
}
d();
