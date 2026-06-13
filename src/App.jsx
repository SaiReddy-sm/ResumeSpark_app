import React, { useContext } from 'react';
import { ResumeProvider, ResumeContext } from './context/ResumeContext';
import Home from './pages/Home';
import Builder from './pages/Builder';
import './styles/global.css';

function MainAppContent() {
  const { view } = useContext(ResumeContext);

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Renders Builder only when explicitly inside work state */}
      {view === 'builder' ? (
        <Builder />
      ) : (
        <Home />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ResumeProvider>
      <MainAppContent />
    </ResumeProvider>
  );
}