// Railway entry point - redirects to backend
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Litein Municipal Backend from root...');
console.log('📁 Current directory:', __dirname);
console.log('🎯 Target: backend/src/server.js');

// Start the backend server
const backendPath = join(__dirname, 'backend', 'src', 'server.js');
const serverProcess = spawn('node', [backendPath], {
  stdio: 'inherit',
  cwd: join(__dirname, 'backend')
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start backend:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`Backend process exited with code ${code}`);
  process.exit(code);
});

// Handle termination
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  serverProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  serverProcess.kill('SIGINT');
});
