const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function createPolicies() {
    console.log("Checking buckets...");
    const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
    if (bErr) return console.error(bErr);

    const hasEcommerce = buckets.some(b => b.name === 'ecommerce');
    if (!hasEcommerce) {
        console.log("Creating ecommerce bucket...");
        await supabase.storage.createBucket('ecommerce', { public: true });
    }

    console.log("Attempting a test upload...");
    const { data, error } = await supabase.storage.from('ecommerce').upload('test.txt', 'test content', {
        upsert: true
    });

    if (error) {
        console.log("Upload failed, RLS Policies might be blocking:");
        console.log(error);
    } else {
        console.log("Upload success!");
    }
}

createPolicies();
