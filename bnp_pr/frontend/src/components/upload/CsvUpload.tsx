import React, { useState } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export const CsvUpload: React.FC = () => {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setStatus('LOADING');
      // Simulate API upload
      setTimeout(() => {
        // Random success or error for demo
        Math.random() > 0.2 ? setStatus('SUCCESS') : setStatus('ERROR');
      }, 1500);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem 2rem' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Upload Trade Events</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Upload CSV or Excel files containing trade events. The system will automatically parse and route them.
      </p>

      <label 
        style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          border: '2px dashed var(--border-color)', borderRadius: 'var(--radius-lg)',
          padding: '3rem', cursor: 'pointer', backgroundColor: 'var(--bg-primary)',
          transition: 'all 0.2s',
          borderColor: status === 'SUCCESS' ? 'var(--status-success)' : status === 'ERROR' ? 'var(--status-error)' : 'var(--brand-primary)'
        }}
      >
        <input type="file" accept=".csv, .xlsx" style={{ display: 'none' }} onChange={handleUpload} disabled={status === 'LOADING'} />
        
        {status === 'IDLE' && (
          <>
            <UploadCloud size={48} color="var(--brand-primary)" style={{ marginBottom: '1rem' }} />
            <span style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Click to browse or drag file here</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Supported formats: CSV, XLSX</span>
          </>
        )}
        
        {status === 'LOADING' && (
          <>
            <Loader size={48} color="var(--brand-primary)" className="animate-spin" style={{ marginBottom: '1rem', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontWeight: 500 }}>Processing file...</span>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </>
        )}
        
        {status === 'SUCCESS' && (
          <>
            <CheckCircle size={48} color="var(--status-success)" style={{ marginBottom: '1rem' }} />
            <span style={{ fontWeight: 500, color: 'var(--status-success)', marginBottom: '0.5rem' }}>Upload Successful!</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>124 events processed and routed. Click to upload another.</span>
          </>
        )}
        
        {status === 'ERROR' && (
          <>
            <AlertCircle size={48} color="var(--status-error)" style={{ marginBottom: '1rem' }} />
            <span style={{ fontWeight: 500, color: 'var(--status-error)', marginBottom: '0.5rem' }}>Upload Failed</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Invalid format or missing required fields. Please check your file and try again.</span>
          </>
        )}
      </label>
    </div>
  );
};
