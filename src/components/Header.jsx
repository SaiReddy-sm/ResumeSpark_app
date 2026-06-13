import React, { useContext } from 'react';
import { ResumeContext } from '../context/ResumeContext';
import { generatePDF } from '../utils/pdfGenerator';

export default function Header() {
  const { saveResume, clearResume, showNotification } = useContext(ResumeContext);

  const handleDownload = async () => {
    try {
      showNotification('Compiling layout sheets...', 'info');
      // Captures all sheets featuring the class 'virtual-sheet' (supports 1 or 2 pages)
      await generatePDF('virtual-sheet', 'my-resume.pdf');
      showNotification('PDF compiled successfully!', 'success');
    } catch (error) {
      console.error(error);
      showNotification('Failed to render PDF. Please refresh and try again.', 'danger');
    }
  };

  return (
    <header className="app-header">
      <div className="logo-container">
        <div className="logo-symbol">⚡</div>
        <div>
          <span className="logo-title">ResumeSpark</span>
          <span className="logo-subtitle" style={{ marginLeft: '6px' }}>Pro</span>
        </div>
      </div>
      
      <div className="header-actions">
        <button 
          onClick={saveResume} 
          className="btn-control btn-control-secondary btn-control-small"
          title="Save all values safely inside local browser cache"
        >
          💾 Save Progress
        </button>
        <button 
          onClick={clearResume} 
          className="btn-control btn-control-danger btn-control-small"
          style={{ opacity: 0.85 }}
          title="Clear all fields to write a fresh resume"
        >
          🧹 Clear Data
        </button>
        <button 
          onClick={handleDownload} 
          className="btn-control btn-control-primary"
          title="Compile and download a high-res PDF file"
        >
          📥 Download PDF
        </button>
      </div>
    </header>
  );
}