const { createClient } = require('./apps/storefront/node_modules/@supabase/supabase-js');
const { PrismaClient } = require('./apps/storefront/node_modules/@prisma/client');
const fs = require('fs');

function loadEnv(path) {
    if (!fs.existsSync(path)) return;
    const content = fs.readFileSync(path, 'utf-8');
    content.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            let value = valueParts.join('=').trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            process.env[key.trim()] = value;
        }
    });
}

loadEnv('apps/storefront/.env');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const projectRef = 'cxhjmercpfeyxfbglqmr';
const password = 'Tugba-0734';

const regions = [
    'eu-central-1',
    'eu-west-1',
    'us-east-1',
    'us-west-1',
    'ap-southeast-1',
    'sa-east-1'
];

async function probeRegions() {
    console.log('--- Probing Regions for Transaction Pooler (6543) ---');
    for (const region of regions) {
        const host = `aws-0-${region}.pooler.supabase.com`;
        console.log(`Checking region: ${region} (${host})...`);

        // We use a simple fetch to see if we can at least reach the port (not really possible with fetch, but we can try DNS)
        // Actually, let's use a dummy node test with the pg driver if we can, but let's try to just use ping first
    }
}

async function testSupabase() {
    console.log('--- Testing Supabase API ---');
    const supabase = createClient(supabaseUrl, supabaseKey);
    try {
        const resp = await fetch(`${supabaseUrl}/rest/v1/`, { headers: { 'apikey': supabaseKey } });
        console.log('Supabase API Status:', resp.status, resp.statusText);
        // Check for x-region header
        console.log('Region Header:', resp.headers.get('x-region') || 'Not found');
    } catch (err) {
        console.error('Supabase API Exception:', err.message);
    }
}

async function runTests() {
    await testSupabase();
}

runTests();
