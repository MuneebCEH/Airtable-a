const { Client } = require('pg');
async function d() {
    const c = new Client({ connectionString: 'postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres', ssl: { rejectUnauthorized: false } });
    await c.connect();
    const r = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'User'");
    console.log('User Columns:', r.rows.map(x => x.column_name));

    const r2 = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'Workspace'");
    console.log('Workspace Columns:', r2.rows.map(x => x.column_name));
    await c.end();
}
d();
