const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up StudyBuddy AI...\n');

// Install frontend dependencies
console.log('📦 Installing frontend dependencies...');
try {
  execSync('npm install', { cwd: './frontend', stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies:', error.message);
  process.exit(1);
}

// Install backend dependencies
console.log('📦 Installing backend dependencies...');
try {
  execSync('npm install', { cwd: './backend', stdio: 'inherit' });
  console.log('✅ Backend dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install backend dependencies:', error.message);
  process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = './backend/.env';
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  fs.copyFileSync('./backend/.env.example', envPath);
  console.log('✅ .env file created from .env.example');
  console.log('⚠️  Please update the .env file with your actual configuration values');
}

console.log('\n🎉 Setup complete! Here are your next steps:');
console.log('1. Update backend/.env with your configuration');
console.log('2. Start MongoDB (if using local)');
console.log('3. Run: npm run dev (from root directory)');
console.log('4. Open http://localhost:5173 in your browser');
