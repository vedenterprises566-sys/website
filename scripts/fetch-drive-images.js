import fs from 'fs';
import path from 'path';
import https from 'https';

const driveImages = [
  { id: 'sheet-daffodil', fileId: '105xFBP96hHxXid9H5sMwnbyF2hvwdwGu', filename: 'daffodil.jpg' },
  { id: 'sheet-rainbow', fileId: '11anqCKDMGU6GIIA41DdsBxm0hEyrbj9E', filename: 'rainbow.jpg' },
  { id: 'sheet-hazel', fileId: '1DuvmcVCblRxuW75iPo_soJvM_E0u2sax', filename: 'hazel.jpg' },
  { id: 'sheet-megamix', fileId: '1vhIj1-GOFMQaweHv_c0c3sBsT8WVHv1Z', filename: 'megamix.jpg' },
  { id: 'sheet-woolly', fileId: '1dD9JwdUvvFiMg1kJ9gFbgKvxFehzeutE', filename: 'woolly.jpg' },
  { id: 'sheet-vislon248', fileId: '1lP7-J8DnnKSWyv-BM_3lrJgoXLC_byC8', filename: 'vislon.jpg' },
  { id: 'sheet-enigma', fileId: '161s9fGr99CdQidBqqxMe32la67SRu70D', filename: 'enigma.jpg' },
  { id: 'sheet-nylonhair', fileId: '1nD0zc8CX0lZm8v20-i-gwkKxG-WYghvO', filename: 'nylonhair.jpg' },
];

const targetDir = path.join(process.cwd(), 'src', 'assets', 'products');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadImage(fileId, destPath) {
  return new Promise((resolve, reject) => {
    const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          const file = fs.createWriteStream(destPath);
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }).on('error', reject);
      } else {
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading Google Drive product images directly to src/assets/products/...');
  for (const item of driveImages) {
    const dest = path.join(targetDir, item.filename);
    try {
      await downloadImage(item.fileId, dest);
      console.log(`Saved ${item.filename} to src/assets/products/${item.filename}`);
    } catch (err) {
      console.error(`Failed to download ${item.filename}:`, err);
    }
  }
  console.log('All product images saved into src/assets/products/ successfully!');
}

main();
