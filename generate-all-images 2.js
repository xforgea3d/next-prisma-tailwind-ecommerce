const fs = require('fs');
const path = require('path');
const https = require('https');

// ── Config ──────────────────────────────────────────────────────────────────
const API_KEY = 'AIzaSyADWShHb259TX_yQfhZpqnViBFpZDuw7d4';
const MODEL = 'gemini-2.0-flash-exp-image-generation';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const SEED_DIR = path.join(__dirname, 'apps', 'storefront', 'public', 'seed');
const ADMIN_SEED_DIR = path.join(__dirname, 'apps', 'admin', 'public', 'seed');
const SKIP_EXISTING = true;
const DELAY_MS = 2500; // delay between requests

// ── Ensure dirs ─────────────────────────────────────────────────────────────
if (!fs.existsSync(SEED_DIR)) fs.mkdirSync(SEED_DIR, { recursive: true });
if (!fs.existsSync(ADMIN_SEED_DIR)) fs.mkdirSync(ADMIN_SEED_DIR, { recursive: true });

// ── All images to generate ──────────────────────────────────────────────────
const allImages = [
   // ── CATEGORY IMAGES (5) ─────────────────────────────────────────────────
   {
      filename: 'cat_figurler.png',
      prompt: 'E-commerce category banner image: collection of premium 3D printed gaming figurines and anime characters displayed on illuminated glass shelves, dramatic orange accent lighting, dark moody atmosphere, cinematic wide shot, 8k resolution',
   },
   {
      filename: 'cat_heykeller.png',
      prompt: 'E-commerce category banner image: classical marble-effect 3D printed busts and sculptures arranged in a museum-like display, warm golden spotlight, elegant dark backdrop, cinematic composition, 8k resolution',
   },
   {
      filename: 'cat_dekoratif.png',
      prompt: 'E-commerce category banner image: modern geometric 3D printed wall art and home decorations in a stylish living room, warm ambient lighting, minimalist Scandinavian interior, cinematic wide shot, 8k resolution',
   },
   {
      filename: 'cat_aksesuarlar.png',
      prompt: 'E-commerce category banner image: collection of 3D printed desk accessories, phone holders and organizers on a modern workspace, warm desk lamp lighting, clean composition, 8k resolution',
   },
   {
      filename: 'cat_arac.png',
      prompt: 'E-commerce category banner image: premium 3D printed custom car accessories and interior parts arranged on a dark surface with automotive background, orange LED accent lights, dramatic studio lighting, 8k resolution',
   },

   // ── CAR BRAND LOGOS (10) ────────────────────────────────────────────────
   {
      filename: 'logo_bmw.png',
      prompt: 'Photorealistic premium 3D render of the BMW logo badge, metallic blue and white propeller design in a circle, chrome border, floating on pure black background, studio reflection lighting, ultra detailed, 8k',
   },
   {
      filename: 'logo_mercedes.png',
      prompt: 'Photorealistic premium 3D render of the Mercedes-Benz logo badge, iconic silver three-pointed star inside a circle, chrome metallic finish, floating on pure black background, studio reflection lighting, ultra detailed, 8k',
   },
   {
      filename: 'logo_audi.png',
      prompt: 'Photorealistic premium 3D render of the Audi logo badge, four interlocking silver chrome rings, metallic finish, floating on pure black background, studio reflection lighting, ultra detailed, 8k',
   },
   {
      filename: 'logo_vw.png',
      prompt: 'Photorealistic premium 3D render of the Volkswagen logo badge, silver V and W letters in a blue circle, chrome border, floating on pure black background, studio reflection lighting, ultra detailed, 8k',
   },
   {
      filename: 'logo_toyota.png',
      prompt: 'Photorealistic premium 3D render of the Toyota logo badge, three overlapping silver ellipses forming a T shape, chrome metallic finish, floating on pure black background, studio reflection lighting, ultra detailed, 8k',
   },
   {
      filename: 'logo_honda.png',
      prompt: 'Photorealistic premium 3D render of the Honda logo badge, silver H letter in a rectangular frame, chrome metallic finish, floating on pure black background, studio reflection lighting, ultra detailed, 8k',
   },
   {
      filename: 'logo_hyundai.png',
      prompt: 'Photorealistic premium 3D render of the Hyundai logo badge, italicized silver H in an oval, chrome metallic finish, floating on pure black background, studio reflection lighting, ultra detailed, 8k',
   },
   {
      filename: 'logo_renault.png',
      prompt: 'Photorealistic premium 3D render of the Renault logo badge, silver diamond shape emblem, chrome metallic finish, floating on pure black background, studio reflection lighting, ultra detailed, 8k',
   },
   {
      filename: 'logo_fiat.png',
      prompt: 'Photorealistic premium 3D render of the Fiat logo badge, red circular emblem with chrome FIAT lettering, metallic finish, floating on pure black background, studio reflection lighting, ultra detailed, 8k',
   },
   {
      filename: 'logo_ford.png',
      prompt: 'Photorealistic premium 3D render of the Ford logo badge, blue oval with white Ford script, chrome border, floating on pure black background, studio reflection lighting, ultra detailed, 8k',
   },

   // ── CAR MODEL IMAGES (20 - 2 per brand) ────────────────────────────────
   // BMW
   {
      filename: 'model_bmw_3serisi.png',
      prompt: 'Professional automotive photography, BMW 3 Series sedan, metallic blue, 3/4 front angle view, dramatic studio lighting with reflections, dark gradient background, 8k resolution',
   },
   {
      filename: 'model_bmw_x5.png',
      prompt: 'Professional automotive photography, BMW X5 SUV, metallic black, 3/4 front angle view, dramatic studio lighting, dark gradient background, 8k resolution',
   },
   // Mercedes
   {
      filename: 'model_mercedes_cserisi.png',
      prompt: 'Professional automotive photography, Mercedes-Benz C-Class sedan, metallic silver, 3/4 front angle view, dramatic studio lighting with reflections, dark gradient background, 8k resolution',
   },
   {
      filename: 'model_mercedes_glc.png',
      prompt: 'Professional automotive photography, Mercedes-Benz GLC SUV, metallic white, 3/4 front angle view, dramatic studio lighting, dark gradient background, 8k resolution',
   },
   // Audi
   {
      filename: 'model_audi_a4.png',
      prompt: 'Professional automotive photography, Audi A4 sedan, metallic grey, 3/4 front angle view, dramatic studio lighting with reflections, dark gradient background, 8k resolution',
   },
   {
      filename: 'model_audi_q5.png',
      prompt: 'Professional automotive photography, Audi Q5 SUV, metallic dark blue, 3/4 front angle view, dramatic studio lighting, dark gradient background, 8k resolution',
   },
   // Volkswagen
   {
      filename: 'model_vw_golf.png',
      prompt: 'Professional automotive photography, Volkswagen Golf hatchback, white, 3/4 front angle view, dramatic studio lighting with reflections, dark gradient background, 8k resolution',
   },
   {
      filename: 'model_vw_tiguan.png',
      prompt: 'Professional automotive photography, Volkswagen Tiguan SUV, metallic grey, 3/4 front angle view, dramatic studio lighting, dark gradient background, 8k resolution',
   },
   // Toyota
   {
      filename: 'model_toyota_corolla.png',
      prompt: 'Professional automotive photography, Toyota Corolla sedan, metallic white, 3/4 front angle view, dramatic studio lighting with reflections, dark gradient background, 8k resolution',
   },
   {
      filename: 'model_toyota_rav4.png',
      prompt: 'Professional automotive photography, Toyota RAV4 SUV, metallic red, 3/4 front angle view, dramatic studio lighting, dark gradient background, 8k resolution',
   },
   // Honda
   {
      filename: 'model_honda_civic.png',
      prompt: 'Professional automotive photography, Honda Civic sedan, metallic dark grey, 3/4 front angle view, dramatic studio lighting with reflections, dark gradient background, 8k resolution',
   },
   {
      filename: 'model_honda_crv.png',
      prompt: 'Professional automotive photography, Honda CR-V SUV, metallic silver, 3/4 front angle view, dramatic studio lighting, dark gradient background, 8k resolution',
   },
   // Hyundai
   {
      filename: 'model_hyundai_tucson.png',
      prompt: 'Professional automotive photography, Hyundai Tucson SUV, metallic dark blue, 3/4 front angle view, dramatic studio lighting with reflections, dark gradient background, 8k resolution',
   },
   {
      filename: 'model_hyundai_kona.png',
      prompt: 'Professional automotive photography, Hyundai Kona compact SUV, two-tone grey and black roof, 3/4 front angle view, dramatic studio lighting, dark gradient background, 8k resolution',
   },
   // Renault
   {
      filename: 'model_renault_clio.png',
      prompt: 'Professional automotive photography, Renault Clio hatchback, metallic orange, 3/4 front angle view, dramatic studio lighting with reflections, dark gradient background, 8k resolution',
   },
   {
      filename: 'model_renault_megane.png',
      prompt: 'Professional automotive photography, Renault Megane sedan, metallic blue, 3/4 front angle view, dramatic studio lighting, dark gradient background, 8k resolution',
   },
   // Fiat
   {
      filename: 'model_fiat_egea.png',
      prompt: 'Professional automotive photography, Fiat Egea (Tipo) sedan, metallic white, 3/4 front angle view, dramatic studio lighting with reflections, dark gradient background, 8k resolution',
   },
   {
      filename: 'model_fiat_500.png',
      prompt: 'Professional automotive photography, Fiat 500 compact city car, retro pastel mint green, 3/4 front angle view, dramatic studio lighting, dark gradient background, 8k resolution',
   },
   // Ford
   {
      filename: 'model_ford_focus.png',
      prompt: 'Professional automotive photography, Ford Focus hatchback, metallic blue, 3/4 front angle view, dramatic studio lighting with reflections, dark gradient background, 8k resolution',
   },
   {
      filename: 'model_ford_puma.png',
      prompt: 'Professional automotive photography, Ford Puma compact SUV crossover, metallic red, 3/4 front angle view, dramatic studio lighting, dark gradient background, 8k resolution',
   },

   // ── CAR PARTS PRODUCTS (10) ────────────────────────────────────────────
   {
      filename: 'part_phone_mount.png',
      prompt: 'Professional product photography of a sleek 3D printed car phone mount holder, matte black with orange accent, clipped to a car air vent, modern car interior background, macro detail shot, studio lighting, 8k resolution',
   },
   {
      filename: 'part_cup_adapter.png',
      prompt: 'Professional product photography of a 3D printed car cup holder adapter insert, matte grey finish, sitting in a car center console cup holder, clean modern car interior, macro detail shot, studio lighting, 8k resolution',
   },
   {
      filename: 'part_keyfob.png',
      prompt: 'Professional product photography of a 3D printed car key fob protective cover case, matte black with carbon fiber texture, displayed next to car keys on dark surface, macro detail shot, studio lighting, 8k resolution',
   },
   {
      filename: 'part_vent_clip.png',
      prompt: 'Professional product photography of a 3D printed car air vent fragrance diffuser clip, geometric honeycomb design, matte white, clipped to car air vent, macro detail shot, studio lighting, 8k resolution',
   },
   {
      filename: 'part_dash_organizer.png',
      prompt: 'Professional product photography of a 3D printed car dashboard organizer tray, matte black, neatly organized with sunglasses and coins, modern car dashboard background, macro detail shot, studio lighting, 8k resolution',
   },
   {
      filename: 'part_gear_knob.png',
      prompt: 'Professional product photography of a custom 3D printed car gear shift knob, metallic grey with orange racing stripe, mounted on a gear stick in a sporty car interior, macro detail shot, studio lighting, 8k resolution',
   },
   {
      filename: 'part_badge.png',
      prompt: 'Professional product photography of a custom 3D printed car emblem badge set, chrome-look metallic finish with orange accents, displayed on dark velvet surface, macro detail shot, studio lighting, 8k resolution',
   },
   {
      filename: 'part_cable_clip.png',
      prompt: 'Professional product photography of 3D printed car cable management clips set, matte black, attached to car dashboard organizing charging cables neatly, macro detail shot, studio lighting, 8k resolution',
   },
   {
      filename: 'part_plate_frame.png',
      prompt: 'Professional product photography of a 3D printed custom license plate frame, matte black with subtle geometric pattern, displayed against dark background, macro detail shot, studio lighting, 8k resolution',
   },
   {
      filename: 'part_mirror_trim.png',
      prompt: 'Professional product photography of 3D printed car side mirror decorative trim covers, carbon fiber effect finish, displayed on dark surface, macro detail shot, studio lighting, 8k resolution',
   },
];

// ── Generate single image via Gemini Imagen API ─────────────────────────────
function generateImage(item) {
   return new Promise((resolve) => {
      const filePath = path.join(SEED_DIR, item.filename);

      if (SKIP_EXISTING && fs.existsSync(filePath)) {
         console.log(`  SKIP (exists): ${item.filename}`);
         return resolve(true);
      }

      console.log(`  Generating: ${item.filename}...`);

      const body = JSON.stringify({
         contents: [{ parts: [{ text: item.prompt }] }],
         generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
      });

      const req = https.request(API_URL, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      }, (res) => {
         let data = '';
         res.on('data', (c) => (data += c));
         res.on('end', () => {
            if (res.statusCode !== 200) {
               console.error(`  FAIL (${res.statusCode}): ${item.filename}`);
               try { console.error('  ', JSON.parse(data).error?.message || data.slice(0, 200)); } catch {}
               return resolve(false);
            }
            try {
               const parsed = JSON.parse(data);
               const parts = parsed.candidates?.[0]?.content?.parts || [];
               const imgPart = parts.find(p => p.inlineData);
               if (imgPart) {
                  const buf = Buffer.from(imgPart.inlineData.data, 'base64');
                  fs.writeFileSync(filePath, buf);
                  // Also copy to admin
                  const adminPath = path.join(ADMIN_SEED_DIR, item.filename);
                  fs.writeFileSync(adminPath, buf);
                  console.log(`  OK: ${item.filename} (${(buf.length / 1024).toFixed(0)}KB)`);
                  resolve(true);
               } else {
                  console.error(`  FAIL (no image in response): ${item.filename}`);
                  resolve(false);
               }
            } catch (e) {
               console.error(`  FAIL (parse): ${item.filename}`, e.message);
               resolve(false);
            }
         });
      });

      req.on('error', (e) => {
         console.error(`  FAIL (network): ${item.filename}`, e.message);
         resolve(false);
      });
      req.write(body);
      req.end();
   });
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
   console.log(`\n=== xForgea3D Image Generator ===`);
   console.log(`Total images: ${allImages.length}`);
   console.log(`Output: ${SEED_DIR}\n`);

   let success = 0, fail = 0, skip = 0;

   for (let i = 0; i < allImages.length; i++) {
      const item = allImages[i];
      const filePath = path.join(SEED_DIR, item.filename);

      if (SKIP_EXISTING && fs.existsSync(filePath)) {
         skip++;
         console.log(`[${i + 1}/${allImages.length}] SKIP: ${item.filename}`);
         continue;
      }

      console.log(`[${i + 1}/${allImages.length}] Generating: ${item.filename}`);
      const ok = await generateImage(item);
      if (ok) success++;
      else fail++;

      // Rate limit delay
      if (i < allImages.length - 1) {
         await new Promise((r) => setTimeout(r, DELAY_MS));
      }
   }

   console.log(`\n=== Done ===`);
   console.log(`Success: ${success} | Failed: ${fail} | Skipped: ${skip}`);
   console.log(`Total: ${success + fail + skip}/${allImages.length}`);
}

main();
