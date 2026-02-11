const { Client } = require('pg');

async function checkAdmin() {
    const pgUrl = "postgresql://postgres.phozwrgnozhgtvierqmv:Muneebtech321%40%23%40%23@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";
    const client = new Client({ connectionString: pgUrl, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        console.log('Connected to Supabase.');

        const res = await client.query('SELECT email, password FROM "User"');
        console.log('Users in database:', res.rows);

        if (res.rows.length === 0) {
            console.log('No users found. Creating admin...');
            await client.query('INSERT INTO "User" (id, email, password, role, name, "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW())',
                ['admin-id-123', 'admin@example.com', 'password123', 'ADMIN', 'Admin User']);
            console.log('Admin created successfully!');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkAdmin();
