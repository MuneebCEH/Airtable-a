const { Client } = require('pg');

const project = 'phozwrgnozhgtvierqmv';
const pass = 'Muneebtech321%40%23%40%23';
const regions = [
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'ap-south-1', 'ap-southeast-1', 'ap-southeast-2',
    'eu-central-1', 'eu-west-1', 'eu-west-2', 'eu-west-3'
];

async function find() {
    for (const region of regions) {
        const url = `postgresql://postgres.${project}:${pass}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true`;
        console.log(`Trying ${region}...`);
        const client = new Client({
            connectionString: url,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 5000
        });
        try {
            await client.connect();
            console.log(`Success! Region is ${region}`);
            await client.end();
            process.exit(0);
        } catch (err) {
            console.log(`Failed ${region}: ${err.message.substring(0, 50)}`);
        }
    }
    console.log('All regions failed.');
}

find();
