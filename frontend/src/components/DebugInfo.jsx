import { useState, useEffect } from 'react';

/**
 * Debug Component - Shows environment info and tests backend connectivity
 * 
 * Usage: Add to your page temporarily
 * import DebugInfo from './components/DebugInfo'
 * <DebugInfo />
 * 
 * Remove after debugging!
 */
export default function DebugInfo() {
  const [backendStatus, setBackendStatus] = useState('Testing...');
  const [newsStatus, setNewsStatus] = useState('Testing...');

  useEffect(() => {
    // Test backend health
    const testBackend = async () => {
      try {
        const response = await fetch('https://litein-municipal.onrender.com/health');
        const data = await response.json();
        setBackendStatus(`✅ Backend OK - ${data.status}`);
      } catch (error) {
        setBackendStatus(`❌ Backend Error: ${error.message}`);
      }
    };

    // Test news API
    const testNews = async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'https://litein-municipal.onrender.com';
      try {
        const response = await fetch(`${API_URL}/api/news?limit=3`);
        const data = await response.json();
        setNewsStatus(`✅ News OK - ${data.data?.length || 0} items`);
      } catch (error) {
        setNewsStatus(`❌ News Error: ${error.message}`);
      }
    };

    testBackend();
    testNews();
  }, []);

  const envVars = {
    'VITE_API_URL': import.meta.env.VITE_API_URL || 'NOT SET',
    'VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL || 'NOT SET',
    'MODE': import.meta.env.MODE,
    'DEV': import.meta.env.DEV,
    'PROD': import.meta.env.PROD,
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#000',
      color: '#0f0',
      padding: '1rem',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxHeight: '200px',
      overflow: 'auto',
      borderTop: '2px solid #0f0'
    }}>
      <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
        🐛 DEBUG INFO (Remove this component after fixing!)
      </div>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Backend Status:</strong> {backendStatus}
      </div>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>News API Status:</strong> {newsStatus}
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Environment Variables:</strong>
      </div>
      
      {Object.entries(envVars).map(([key, value]) => (
        <div key={key} style={{ paddingLeft: '1rem' }}>
          {key}: <span style={{ color: value.includes('NOT SET') ? '#f00' : '#0f0' }}>
            {value}
          </span>
        </div>
      ))}

      <div style={{ marginTop: '0.5rem', fontSize: '10px', opacity: 0.7 }}>
        If VITE_API_URL shows "NOT SET", your environment variables aren't configured on Cloudflare Pages.
        See CLOUDFLARE_ENV_FIX.md for instructions.
      </div>
    </div>
  );
}
