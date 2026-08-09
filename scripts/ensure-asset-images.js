import fs from 'fs';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'src', 'assets', 'products');

const baseFallbackMap = {
  'daffodil.jpg': 'our_fancy_yarns_space_polyster_yarn_300_denier_to_550_denier_ceefe0f8-9541-4e93-bef3-1e36bc1b794b.jpg',
  'rainbow.jpg': 'our_fancy_yarns_space_polyster_yarn_300_denier_to_550_denier_ceefe0f8-9541-4e93-bef3-1e36bc1b794b.jpg',
  'hazel.jpg': 'our_fancy_yarns_grace_yarn_d6a6eb49-74c3-454e-af0f-7b0cca3b504a.jpg',
  'megamix.jpg': 'our_china_yarn_0.9_swead_yarn_a72713db-f14a-42bf-b84a-87ef3e829fe5.jpg',
  'woolly.jpg': 'our_china_yarn_2-18_wooly_yarn_352df72e-85ca-4f4b-a410-a9858b7676ca.jpg',
  'vislon.jpg': 'our_china_yarn_2-48_vislon_yarn_352df72e-85ca-4f4b-a410-a9858b7676ca.jpg',
  'enigma.jpg': 'our_china_yarn_0.9_swead_yarn_a0c9e39c-57c4-4fba-9bb8-4a96b44481c9.jpg',
  'nylonhair.jpg': 'our_china_yarn_1.3_cm_hair_yarn_e70baceb-e2fb-4271-8c3c-76ecdffa3ba8.jpg'
};

for (const [targetName, sourceName] of Object.entries(baseFallbackMap)) {
  const targetPath = path.join(assetsDir, targetName);
  const sourcePath = path.join(assetsDir, sourceName);
  if (!fs.existsSync(targetPath) && fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${sourceName} -> ${targetName}`);
  }
}
