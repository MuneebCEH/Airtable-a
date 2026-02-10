const { PrismaClient } = require('@prisma/client');

async function test() {
    const pgUrl = "postgresql://postgres:Muneebtech321%40%23%40%23@db.phozwrgnozhgtvierqmv.supabase.co:5432/postgres";
    const pg = new PrismaClient({ datasources: { db: { url: pgUrl } } });
    try {
        await pg.$connect();
        console.log('PG CONNECTED!');
        const count = await pg.user.count();
        console.log('User count:', count);
    } catch (err) {
        console.error('PG FAILED:', err.message);
    } finally {
        await pg.$disconnect();
    }
}
test();
