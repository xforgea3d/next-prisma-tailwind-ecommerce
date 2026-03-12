const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
   console.error('GEMINI_API_KEY environment variable is required.');
   process.exit(1);
}

const MODEL = 'imagen-4.0-generate-001';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

const CONCURRENCY = 3;
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

const itemsToGenerate = [
   {
      filename: 'brand_xforge.png',
      prompt:
         'A hyper realistic, elegant minimalist 3D printing brand logo, dark slate grey and metallic silver, high-end studio lighting, 8k resolution',
   },
   {
      filename: 'brand_nintendo.png',
      prompt:
         'A hyper realistic, modern minimalist gaming brand logo inspired by Nintendo classic red, premium, 8k resolution',
   },
   {
      filename: 'prod_malenia.png',
      prompt:
         'Hyper realistic, professional studio photography of a Malenia figurine from Elden Ring, 3D printed premium resin, unpainted grey and dark wash, highly detailed, dark cinematic lighting, 8k resolution, macro photography',
   },
   {
      filename: 'prod_zelda.png',
      prompt:
         'Hyper realistic, professional studio photography of a full-size Master Sword replica from Zelda, 3D printed PLA, metallic blue and silver finish, hanging on a dark textured wall, highly detailed, dramatic lighting, 8k resolution',
   },
   {
      filename: 'prod_apollo.png',
      prompt:
         'Hyper realistic, professional studio photography of a 3D printed marble effect Apollo bust statue, classical Greek style, resting on a wooden desk, highly detailed, soft warm lighting, 8k resolution',
   },
   {
      filename: 'prod_dusunena.png',
      prompt:
         'Hyper realistic, professional studio photography of a 3D printed low-poly geometric Thinker statue by Rodin, matte black finish, modern minimalist desk, highly detailed, moody lighting, 8k resolution',
   },
   {
      filename: 'prod_kurt.png',
      prompt:
         'Hyper realistic, professional studio photography of a 3D printed geometric low-poly wolf head wall decor, matte grey finish, mounted on a stark white wall, dramatic shadow, 8k resolution',
   },
   {
      filename: 'prod_astronot.png',
      prompt:
         'Hyper realistic, professional studio photography of a 3D printed cute astronaut phone holder, glossy white and gold visor, sitting on a modern desk, 8k resolution, macro shot',
   },
];

const storefrontDir = path.join(
   __dirname,
   'apps',
   'storefront',
   'public',
   'seed',
);
const adminDir = path.join(__dirname, 'apps', 'admin', 'public', 'seed');

if (!fs.existsSync(storefrontDir))
   fs.mkdirSync(storefrontDir, { recursive: true });
if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, { recursive: true });

async function generateSingleImage(item) {
   for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
         const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               instances: [{ prompt: item.prompt }],
               parameters: { sampleCount: 1, aspectRatio: '1:1' },
            }),
         });

         if (!res.ok) {
            const body = await res.text();
            throw new Error(`HTTP ${res.status}: ${body}`);
         }

         const data = await res.json();

         if (!data.predictions || data.predictions.length === 0) {
            throw new Error('No predictions returned');
         }

         const base64Data = data.predictions[0].bytesBase64Encoded;
         const buffer = Buffer.from(base64Data, 'base64');

         fs.writeFileSync(path.join(storefrontDir, item.filename), buffer);
         fs.writeFileSync(path.join(adminDir, item.filename), buffer);

         console.log(`[OK] ${item.filename} (attempt ${attempt + 1})`);
         return { filename: item.filename, success: true };
      } catch (err) {
         console.warn(
            `[RETRY] ${item.filename} attempt ${attempt + 1}/${MAX_RETRIES}: ${err.message}`,
         );
         if (attempt === MAX_RETRIES - 1) {
            throw err;
         }
         await new Promise((r) =>
            setTimeout(r, BASE_DELAY_MS * Math.pow(2, attempt)),
         );
      }
   }
}

async function start() {
   const startTime = Date.now();

   // Dynamic import for ESM-only p-limit
   const { default: pLimit } = await import('p-limit');
   const limit = pLimit(CONCURRENCY);

   console.log(
      `Starting image generation: ${itemsToGenerate.length} images, concurrency=${CONCURRENCY}`,
   );

   const results = await Promise.allSettled(
      itemsToGenerate.map((item) => limit(() => generateSingleImage(item))),
   );

   const succeeded = results.filter((r) => r.status === 'fulfilled');
   const failed = results.filter((r) => r.status === 'rejected');

   const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

   console.log(`\n--- Results ---`);
   console.log(`Succeeded: ${succeeded.length}/${itemsToGenerate.length}`);

   if (failed.length > 0) {
      console.error(`Failed: ${failed.length}/${itemsToGenerate.length}`);
      failed.forEach((r) => console.error(`  - ${r.reason.message}`));
   }

   console.log(`Total time: ${elapsed}s`);
}

start();
