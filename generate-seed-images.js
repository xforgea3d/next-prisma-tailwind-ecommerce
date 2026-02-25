const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = 'AIzaSyBH6Hmhenf1blZm2TVT0qrnJ1Jv7wRInPM';
const MODEL = 'imagen-4.0-generate-001'; // Default model for image generation in Gemini API

const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

const itemsToGenerate = [
    {
        filename: 'brand_xforge.png',
        prompt: 'A hyper realistic, elegant minimalist 3D printing brand logo, dark slate grey and metallic silver, high-end studio lighting, 8k resolution'
    },
    {
        filename: 'brand_nintendo.png',
        prompt: 'A hyper realistic, modern minimalist gaming brand logo inspired by Nintendo classic red, premium, 8k resolution'
    },
    {
        filename: 'prod_malenia.png',
        prompt: 'Hyper realistic, professional studio photography of a Malenia figurine from Elden Ring, 3D printed premium resin, unpainted grey and dark wash, highly detailed, dark cinematic lighting, 8k resolution, macro photography'
    },
    {
        filename: 'prod_zelda.png',
        prompt: 'Hyper realistic, professional studio photography of a full-size Master Sword replica from Zelda, 3D printed PLA, metallic blue and silver finish, hanging on a dark textured wall, highly detailed, dramatic lighting, 8k resolution'
    },
    {
        filename: 'prod_apollo.png',
        prompt: 'Hyper realistic, professional studio photography of a 3D printed marble effect Apollo bust statue, classical Greek style, resting on a wooden desk, highly detailed, soft warm lighting, 8k resolution'
    },
    {
        filename: 'prod_dusunena.png',
        prompt: 'Hyper realistic, professional studio photography of a 3D printed low-poly geometric Thinker statue by Rodin, matte black finish, modern minimalist desk, highly detailed, moody lighting, 8k resolution'
    },
    {
        filename: 'prod_kurt.png',
        prompt: 'Hyper realistic, professional studio photography of a 3D printed geometric low-poly wolf head wall decor, matte grey finish, mounted on a stark white wall, dramatic shadow, 8k resolution'
    },
    {
        filename: 'prod_astronot.png',
        prompt: 'Hyper realistic, professional studio photography of a 3D printed cute astronaut phone holder, glossy white and gold visor, sitting on a modern desk, 8k resolution, macro shot'
    }
];

// Ensure directories exist
const storefrontDir = path.join(__dirname, 'apps', 'storefront', 'public', 'seed');
const adminDir = path.join(__dirname, 'apps', 'admin', 'public', 'seed');

if (!fs.existsSync(storefrontDir)) fs.mkdirSync(storefrontDir, { recursive: true });
if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, { recursive: true });

async function generateSingleImage(item) {
    console.log(`Generating image for: ${item.filename}...`);

    const requestData = JSON.stringify({
        instances: [{ prompt: item.prompt }],
        parameters: { sampleCount: 1, aspectRatio: "1:1" }
    });

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(URL, options, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.error(`Failed to generate ${item.filename}. Status: ${res.statusCode}`);
                    console.error(data);
                    return resolve(false);
                }

                try {
                    const parsed = JSON.parse(data);
                    if (parsed.predictions && parsed.predictions.length > 0) {
                        const base64Data = parsed.predictions[0].bytesBase64Encoded;
                        const buffer = Buffer.from(base64Data, 'base64');

                        // Save to both storefront and admin public/seed folders
                        fs.writeFileSync(path.join(storefrontDir, item.filename), buffer);
                        fs.writeFileSync(path.join(adminDir, item.filename), buffer);

                        console.log(`Successfully saved ${item.filename} to both public/seed folders.`);
                        resolve(true);
                    } else {
                        console.error(`No predictions returned for ${item.filename}`);
                        resolve(false);
                    }
                } catch (e) {
                    console.error(`Error parsing response for ${item.filename}:`, e);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Request error for ${item.filename}:`, e);
            resolve(false);
        });

        req.write(requestData);
        req.end();
    });
}

async function start() {
    for (const item of itemsToGenerate) {
        await generateSingleImage(item);
        // Small delay to prevent rate limits
        await new Promise(r => setTimeout(r, 2000));
    }
    console.log("Image generation process completed.");
}

start();
