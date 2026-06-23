// Railway entry point - redirects to backend
// This file must be ES module compatible
import('dotenv/config');
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Litein Municipal Backend...');
console.log('📁 Root directory:', __dirname);
console.log('🎯 Backend path: backend/src/server.js');
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');

// Change to backend directory and run npm start
const backendDir = join(__dirname, 'backend');
console.log('📂 Changing to backend directory:', backendDir);

// Run npm start in backend directory
const serverProcess = spawn('npm', ['start'], {
  stdio: 'inherit',
  cwd: backendDir,
  shell: true,
  env: { ...process.env }
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start backend:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Backend process exited with code ${code}`);
  }
  process.exit(code || 0);
});

// Handle termination signals
process.on('SIGTERM', () => {
  console.log('📡 Received SIGTERM, shutting down gracefully...');
  serverProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📡 Received SIGINT, shutting down gracefully...');
  serverProcess.kill('SIGINT');
});
