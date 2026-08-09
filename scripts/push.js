import { execSync } from 'child_process';

try {
  console.log('Staging files...');
  execSync('git add .', { stdio: 'inherit' });
  console.log('Committing changes...');
  execSync('git commit -m "Redesign product cards with Google Sheet action buttons"', { stdio: 'inherit' });
  console.log('Pushing to main branch...');
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('Successfully pushed changes to Git!');
} catch (error) {
  console.error('Git execution result:', error.message || error);
}
