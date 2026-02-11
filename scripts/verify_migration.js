const { Client } = require('pg');
async function verify() {
    const c = new Client({ connectionString: 'postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres', ssl: { rejectUnauthorized: false } });
    await c.connect();
    const projects = await c.query('SELECT name FROM "Project"');
    console.log('Projects on Supabase:', projects.rows);
    const sheets = await c.query('SELECT "name" FROM "Sheet"');
    console.log('Total Sheets:', sheets.rows.length);
    const rows = await c.query('SELECT count(*) FROM "Row"');
    console.log('Total Rows:', rows.rows[0].count);
    await c.end();
}
verify();
