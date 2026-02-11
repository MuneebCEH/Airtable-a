const { Client } = require('pg');
async function fix() {
    const c = new Client({ connectionString: 'postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres', ssl: { rejectUnauthorized: false } });
    await c.connect();

    // Check EXACT column names
    const r = await c.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'User'");
    console.log('User columns:', r.rows.map(x => x.column_name));

    // Try to insert with what we have
    const columns = r.rows.map(x => x.column_name);
    const data = {
        id: 'admin-manual-fix',
        email: 'admin@example.com',
        password: 'password123',
        role: 'ADMIN',
        name: 'Admin User'
    };

    // Add timestamps if they exist
    if (columns.includes('createdAt')) data.createdAt = new Date();
    if (columns.includes('updatedAt')) data.updatedAt = new Date();
    if (columns.includes('created_at')) data.created_at = new Date();
    if (columns.includes('updated_at')) data.updated_at = new Date();

    const keys = Object.keys(data);
    const vals = Object.values(data);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO "User" (${keys.map(k => `"${k}"`).join(', ')}) VALUES (${placeholders}) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password`;

    await c.query(query, vals);
    console.log('ADMIN CREATED/UPDATED SUCCESSFULLY!');

    await c.end();
}
fix().catch(console.error);
