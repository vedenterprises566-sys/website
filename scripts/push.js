import { execSync } from 'child_process';

try {
  console.log('Downloading Google Drive product images locally for instant page loading...');
  try {
    execSync('node scripts/fetch-drive-images.js', { stdio: 'inherit' });
  } catch (e) {
    console.warn('Image fetch warning:', e.message);
  }

  console.log('Staging files...');
  execSync('git add .', { stdio: 'inherit' });
  console.log('Committing changes...');
  execSync('git commit -m "Optimize product images locally and link Google Drive shade cards"', { stdio: 'inherit' });
  console.log('Pushing to main branch...');
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('Successfully pushed changes to Git!');
} catch (error) {
  console.error('Git execution result:', error.message || error);
}
