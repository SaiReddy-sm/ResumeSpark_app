import React, { useContext, useState, useEffect } from 'react';
import { ResumeContext } from '../context/ResumeContext';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import { generatePDF } from '../utils/pdfGenerator';
import '../styles/form.css';

// Sleek, light outline SVG icons mapped to Lucide guidelines
const LucideIcons = {
  Back: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
  ),
  Settings: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
  ),
  FileText: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
  ),
  Customize: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 3 21 3 19 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
  ),
  Upload: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
  ),
  Code: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
  )
};

const COLOR_PRESETS = [
  { name: 'Slate Obsidian', value: '#0f172a' },
  { name: 'Midnight Sapphire', value: '#1e3a8a' },
  { name: 'Antique Bronze', value: '#b8935c' },
  { name: 'Forest Spruce', value: '#0f766e' },
  { name: 'Tuscan Burgundy', value: '#991b1b' },
  { name: 'Slate Editorial', value: '#475569' }
];

const PREMIUM_TEMPLATES = [
  { id: 'ats_essential', label: 'ATS Essential', category: 'ATS', avatar: '🤖' },
  { id: 'classic_scholar', label: 'ATS Professional', category: 'ATS', avatar: '🎓' },
  { id: 'minimal_focus', label: 'ATS Executive', category: 'ATS', avatar: '✏️' },
  { id: 'corporate_prime', label: 'Corporate Prime', category: 'Professional', avatar: '💼' },
  { id: 'elegant_serif', label: 'Executive Elite', category: 'Professional', avatar: '👑' },
  { id: 'business_elite', label: 'Business Prestige', category: 'Professional', avatar: '🏛️' },
  { id: 'modern_edge', label: 'Modern Edge (Grid 1)', category: 'Modern Side Grid', avatar: '⚡' },
  { id: 'creative_sidebar', label: 'Creative Sidebar (Grid 2)', category: 'Modern Side Grid', avatar: '📐' },
  { id: 'designer_glow', label: 'Designer Glow (Grid 3)', category: 'Modern Side Grid', avatar: '🌟' },
  { id: 'academic_pro', label: 'Tech Innovator (Grid 4)', category: 'Modern Side Grid', avatar: '💻' },
  { id: 'startup_clean', label: 'Startup Clean (Grid 5)', category: 'Modern Side Grid', avatar: '🚀' },
  { id: 'modern_split', label: 'Modern Split (Grid 6)', category: 'Modern Side Grid', avatar: '▫️' },
  { id: 'smart_graduate', label: 'Graduate Launch', category: 'Student', avatar: '💡' },
  { id: 'tech_fresher', label: 'Campus Achiever', category: 'Student', avatar: '🏫' }
];

export default function Builder() {
  const {
    resumeData,
    setView,
    activeTab,
    setActiveTab,
    updateCustomization,
    updateResumeName,
    toggleSecondPage,
    clearResume,
    selectTemplateLayout,
    updatePersonalInfo,
    toast,
    showNotification
  } = useContext(ResumeContext);

  const [zoom, setZoom] = useState(0.85);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(resumeData.resumeName);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [stats, setStats] = useState({ words: 0, chars: 0, sections: 0, pages: 1, completion: 0 });

  // Dedicated Full Preview Mode state
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Drag and Drop reordering state
  const [draggedIndex, setDraggedIndex] = useState(null);

  const defaultCoreIds = ['summary', 'experience', 'education', 'skills', 'languages', 'achievements', 'interests'];

  // Resolve dynamic headings correctly
  const coreLabels = {
    summary: resumeData.customization?.sectionHeadings?.summary || 'Professional Summary',
    experience: resumeData.customization?.sectionHeadings?.experience || 'Experience & Projects',
    education: resumeData.customization?.sectionHeadings?.education || 'Education History',
    skills: resumeData.customization?.sectionHeadings?.skills || 'Skills & Tools',
    languages: resumeData.customization?.sectionHeadings?.languages || 'Languages',
    achievements: resumeData.customization?.sectionHeadings?.achievements || 'Achievements',
    interests: resumeData.customization?.sectionHeadings?.interests || 'Interests'
  };

  // Build the unified layout list
  const activeCoreIds = ['summary', 'experience', 'education', 'skills', 'languages', 'achievements', 'interests'];
  const customSectionItems = resumeData.customSections || [];
  
  const activeIds = [
    ...activeCoreIds,
    ...customSectionItems.map(c => c.id)
  ];

  const savedOrder = resumeData.customization?.sectionOrder || defaultCoreIds;

  // Filter out removed items, append any new custom section items
  const sortedIds = [
    ...savedOrder.filter(id => activeIds.includes(id)),
    ...activeIds.filter(id => !savedOrder.includes(id))
  ];

  // Keep section order in sync if custom sections are added or removed
  useEffect(() => {
    const currentOrderStr = JSON.stringify(resumeData.customization?.sectionOrder || []);
    const expectedOrderStr = JSON.stringify(sortedIds);
    if (currentOrderStr !== expectedOrderStr) {
      updateCustomization('sectionOrder', sortedIds);
    }
  }, [resumeData.customSections]);

  useEffect(() => {
    const summaryText = resumeData.personalInfo.summary || '';
    const experiencesText = (resumeData.experience || []).map(e => e.description || '').join(' ');
    const educationsText = (resumeData.education || []).map(e => e.school || '').join(' ');
    const skillsText = (resumeData.skills || []).join(' ');
    
    const combinedText = `${summaryText} ${experiencesText} ${educationsText} ${skillsText}`;
    const words = combinedText.trim() === '' ? 0 : combinedText.trim().split(/\s+/).length;
    const chars = combinedText.length;

    let sectionCount = 1;
    if (resumeData.skills && resumeData.skills.length > 0) sectionCount++;
    if (resumeData.education && resumeData.education.length > 0) sectionCount++;
    if (resumeData.experience && resumeData.experience.length > 0) sectionCount++;
    if (resumeData.languages && resumeData.languages.length > 0) sectionCount++;
    if (resumeData.achievements && resumeData.achievements.length > 0) sectionCount++;
    if (resumeData.interests && resumeData.interests.length > 0) sectionCount++;
    if (resumeData.customSections && resumeData.customSections.length > 0) sectionCount++;

    const pages = resumeData.enableSecondPage ? 2 : 1;

    let completion = 20; 
    if (resumeData.personalInfo.email) completion += 15;
    if (resumeData.personalInfo.phone) completion += 15;
    if (resumeData.skills && resumeData.skills.length > 0) completion += 15;
    if (resumeData.experience && resumeData.experience.length > 0) completion += 20;
    if (resumeData.education && resumeData.education.length > 0) completion += 15;

    setStats({ words, chars, sections: sectionCount, pages, completion });
  }, [resumeData]);

  const handleDownload = async () => {
    try {
      showNotification('Compiling visual document...', 'info');
      await generatePDF('virtual-sheet', `${resumeData.resumeName || 'my-resume'}.pdf`);
      showNotification('PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error(err);
      showNotification('Error compiling PDF. Try adjusting zoom to 100%.', 'danger');
    }
  };

  const handleSaveName = () => {
    updateResumeName(nameInput);
    setIsEditingName(false);
    showNotification('Document renamed!');
  };

  const handleDuplicate = () => {
    updateResumeName(`${resumeData.resumeName} (Copy)`);
    showNotification('Document duplicated successfully!');
  };

  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = (file) => {
    if (file) {
      if (file.size > 800 * 1024) {
        showNotification('Photo size must be under 800KB', 'danger');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo('image', reader.result);
        showNotification('Profile photo processed successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  // HTML5 Drag and Drop event handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const reordered = [...sortedIds];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    updateCustomization('sectionOrder', reordered);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="builder-layout" style={{ 
      display: 'grid',
      gridTemplateColumns: isPreviewMode ? '1fr' : '460px 1fr',
      backgroundColor: '#FAFAFC', 
      height: 'calc(100vh - 58px)',
      overflow: 'hidden'
    }}>
      
      {/* 1. LEFT WORKSPACE PANEL (Hides when Full Preview is active) */}
      <div className="form-panel" style={{ 
        display: isPreviewMode ? 'none' : 'flex', 
        flexDirection: 'column', 
        padding: '0', 
        borderRight: '1px solid #e2e8f0', 
        background: '#ffffff', 
        height: '100%',
        overflow: 'hidden',
        zIndex: 10 
      }}>
        
        {/* TOP STATUS BAR: DOCUMENT ID & DOWNLOAD */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={() => setView('landing')} 
              style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '700', color: '#475569', borderRadius: '6px', padding: '0.35rem 0.6rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Return to Landing Page"
            >
              <LucideIcons.Back />
              <span>Back</span>
            </button>
            {isEditingName ? (
              <div style={{ display: 'flex', gap: '4px' }}>
                <input 
                  type="text" 
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  style={{ width: '120px', padding: '0.3rem 0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
                <button onClick={handleSaveName} style={{ border: 'none', background: '#7C3AED', color: '#fff', padding: '0 0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700' }}>Save</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0F172A', letterSpacing: '-0.3px' }}>{resumeData.resumeName}</span>
                <button 
                  onClick={() => setIsEditingName(true)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#94a3b8' }}
                  title="Rename Document"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={handleDownload} 
            className="premium-btn"
            style={{
              padding: '0.55rem 1.15rem',
              fontSize: '0.8rem',
              borderRadius: '8px'
            }}
          >
            📥 Download PDF
          </button>
        </div>

        {/* WORKSPACE NAVIGATION TABS - Re-proportioned to 3 proportional tabs (AI completely removed) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderBottom: '1px solid #f1f5f9',
          backgroundColor: '#fafbfc'
        }}>
          {['overview', 'content', 'customize'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.9rem 0',
                  border: 'none',
                  background: isActive ? '#ffffff' : 'transparent',
                  borderBottom: isActive ? '3px solid #7C3AED' : 'none',
                  color: isActive ? '#7C3AED' : '#64748B',
                  fontWeight: '800',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.7px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {tab === 'overview' && <LucideIcons.Settings />}
                {tab === 'content' && <LucideIcons.FileText />}
                {tab === 'customize' && <LucideIcons.Customize />}
                {tab}
              </button>
            );
          })}
        </div>

        {/* WORKSPACE TAB CONTENT PANEL */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* SAAS STATS CARD */}
              <div className="form-section-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
                <div className="form-section-header">
                  <span className="icon-badge" style={{ color: '#7C3AED' }}>📊</span>
                  <h3>Resume Statistics</h3>
                </div>
                
                {/* Visual Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '1rem' }}>
                  <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #f1f5f9', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: '800', textTransform: 'uppercase' }}>Words</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{stats.words}</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #f1f5f9', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: '800', textTransform: 'uppercase' }}>Characters</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{stats.chars}</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #f1f5f9', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: '800', textTransform: 'uppercase' }}>Active Sections</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{stats.sections}</div>
                  </div>
                  <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '8px', border: '1px solid #f1f5f9', textAlign: 'left' }}>
                    <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: '800', textTransform: 'uppercase' }}>Pages</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{stats.pages}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569', fontWeight: '700', marginBottom: '6px' }}>
                    <span>Profile Completion</span>
                    <span>{stats.completion}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ width: `${stats.completion}%`, height: '100%', background: 'linear-gradient(135deg, #06B6D4, #7C3AED, #EC4899)', borderRadius: '99px', transition: 'width 0.4s ease' }}></div>
                  </div>
                </div>
              </div>

              {/* DOCUMENT SETTINGS */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <span className="icon-badge">⚙️</span>
                  <h3>Document Control Settings</h3>
                </div>

                <div className="form-group-block">
                  <label className="form-label-title">Rename Document</label>
                  <input 
                    type="text" 
                    className="form-field-input"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Resume Name"
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    <button 
                      onClick={handleSaveName} 
                      className="btn-control btn-control-secondary btn-control-small" 
                      style={{ flex: '1 1 45%', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      Apply Name
                    </button>
                    <button 
                      onClick={handleDuplicate} 
                      className="btn-control btn-control-secondary btn-control-small" 
                      style={{ flex: '1 1 45%', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                    >
                      <LucideIcons.Copy />
                      Duplicate
                    </button>
                    
                    {/* DRAFT PREVIEW ACTION BUTTON */}
                    <button 
                      onClick={() => setShowDraftModal(true)} 
                      className="btn-control btn-control-secondary btn-control-small" 
                      style={{ flex: '1 1 90%', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}
                    >
                      <LucideIcons.Code />
                      See Draft
                    </button>
                  </div>
                </div>

                <div className="second-page-toggle-wrapper" style={{ margin: 0, padding: '1rem', marginTop: '1.5rem' }}>
                  <div className="toggle-info-panel">
                    <h4 style={{ fontSize: '0.9rem' }}>Add Second Page</h4>
                    <p style={{ fontSize: '0.72rem' }}>Expand layout elements across two sequential portfolio sheets.</p>
                  </div>
                  <label className="toggle-switch-widget">
                    <input 
                      type="checkbox" 
                      checked={resumeData.enableSecondPage}
                      onChange={(e) => toggleSecondPage(e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>

              {/* DRAG AND DROP PROFILE PHOTO SETTINGS */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <span className="icon-badge">📷</span>
                  <h3>Profile Avatar Setup</h3>
                </div>

                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  style={{
                    border: isDragOver ? '2px dashed #7C3AED' : '2px dashed #cbd5e1',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    background: isDragOver ? 'rgba(124, 58, 237, 0.02)' : '#F8FAFC',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '1rem'
                  }}
                >
                  <input 
                    type="file" 
                    id="avatar-dropzone" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{ display: 'none' }} 
                  />
                  <label htmlFor="avatar-dropzone" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <LucideIcons.Upload />
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A' }}>Drag & Drop Profile Photo</span>
                    <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Supports PNG, JPEG up to 800KB</span>
                  </label>
                </div>

                {resumeData.personalInfo.image && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={resumeData.personalInfo.image} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} alt="Avatar Preview" />
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#475569' }}>Photo uploaded</span>
                    </div>
                    <button 
                      onClick={() => updatePersonalInfo('image', '')}
                      className="btn-control btn-control-danger btn-control-small"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <LucideIcons.Trash />
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* RESET WORKSPACE */}
              <div className="form-section-card" style={{ border: '1.5px dashed #f43f5e', background: '#fffafb' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#e11d48', marginBottom: '0.5rem', fontWeight: '800' }}>Reset Workspace</h4>
                <p style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '1.25rem', lineHeight: '1.45' }}>
                  Warning: Clears all cached details and uploaded photographs inside your local browser storage.
                </p>
                <button 
                  onClick={clearResume} 
                  className="btn-control btn-control-danger btn-control-small"
                  style={{ width: '100%', fontWeight: '700' }}
                >
                  Confirm Full Clear
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT ACCORDIONS */}
          {activeTab === 'content' && <ResumeForm />}

          {/* TAB 3: CUSTOMIZE SIDEBAR (Header, Details, Spacing, Live Switcher) */}
          {activeTab === 'customize' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* LAYOUT SECTION ORDERING (DRAG & DROP) */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <span className="icon-badge">↕️</span>
                  <h3>Section Layout Order</h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                  Drag and drop to rearrange sections on your resume. Long-press to drag.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sortedIds.map((id, index) => {
                    const isCustom = id.startsWith('cust-');
                    const label = isCustom 
                      ? (resumeData.customSections.find(c => c.id === id)?.title || 'Custom Section')
                      : coreLabels[id];
                    
                    if (!label) return null;

                    return (
                      <div
                        key={id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: draggedIndex === index ? '#f5f3ff' : '#ffffff',
                          border: draggedIndex === index ? '2px dashed #7c3aed' : '1px solid #e2e8f0',
                          boxShadow: draggedIndex === index ? 'none' : '0 1px 3px rgba(0,0,0,0.02)',
                          cursor: 'grab',
                          userSelect: 'none',
                          transition: 'background-color 0.1s ease, border 0.1s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ color: '#cbd5e1', fontSize: '1.1rem', cursor: 'grab' }}>☰</span>
                          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0F172A' }}>
                            {label}
                          </span>
                        </div>
                        {isCustom && (
                          <span style={{ 
                            fontSize: '0.62rem', 
                            padding: '2px 6px', 
                            borderRadius: '99px', 
                            backgroundColor: '#e0f2fe', 
                            color: '#0369a1', 
                            fontWeight: 'bold' 
                          }}>
                            Custom
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PROFILE PHOTO SIZE SLIDER */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <span className="icon-badge">🖼️</span>
                  <h3>Avatar Size</h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                  Configure the dimensions of your profile picture from 60px to 120px.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <input 
                    type="range" 
                    min="60" 
                    max="120" 
                    step="5"
                    value={resumeData.customization?.photoSize || 80}
                    onChange={(e) => updateCustomization('photoSize', Number(e.target.value))}
                    style={{ flex: 1, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#475569', minWidth: '42px', textAlign: 'right' }}>
                    {resumeData.customization?.photoSize || 80}px
                  </span>
                </div>
              </div>

              {/* LIVE TEMPLATE SWITCHER (Configured with 6 Distinct Grid Templates) */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <span className="icon-badge">⚡</span>
                  <h3>Quick Template Switcher</h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                  Switch layouts in real-time to watch your content restyle dynamically.
                </p>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: '8px', 
                  maxHeight: '220px', 
                  overflowY: 'auto',
                  paddingRight: '4px'
                }}>
                  {PREMIUM_TEMPLATES.map((tpl) => {
                    const isSelected = resumeData.template === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        onClick={() => selectTemplateLayout(tpl.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #7C3AED' : '1px solid #e2e8f0',
                          background: isSelected ? 'rgba(124, 58, 237, 0.03)' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontSize: '1rem' }}>{tpl.avatar}</span>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{tpl.label}</div>
                          <div style={{ fontSize: '0.62rem', color: '#64748b' }}>{tpl.category}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DESIGNER COLOR PALETTES */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <span className="icon-badge">🎨</span>
                  <h3>Designer Accent Presets</h3>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem' }}>
                  Select one of our curated classic palettes to style your layout instantly.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  {COLOR_PRESETS.map((color) => {
                    const isSelected = resumeData.customization.accentColor === color.value;
                    return (
                      <button
                        key={color.value}
                        onClick={() => updateCustomization('accentColor', color.value)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: color.value,
                          border: isSelected ? '2px solid #0f172a' : '2px solid #ffffff',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                        title={color.name}
                      >
                        {isSelected && <span style={{ color: '#fff', fontSize: '10px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>✓</span>}
                      </button>
                    );
                  })}
                </div>

                <div className="form-group-block" style={{ margin: 0 }}>
                  <label className="form-label-title">Custom HEX Code Picker</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input 
                      type="color" 
                      value={resumeData.customization.accentColor || '#1e3a8a'} 
                      onChange={(e) => updateCustomization('accentColor', e.target.value)}
                      style={{ border: 'none', width: '38px', height: '38px', borderRadius: '6px', cursor: 'pointer' }}
                    />
                    <input 
                      type="text" 
                      value={resumeData.customization.accentColor || ''} 
                      onChange={(e) => updateCustomization('accentColor', e.target.value)}
                      style={{ width: '100px', padding: '0.35rem', fontSize: '0.85rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}
                    />
                  </div>
                </div>
              </div>

              {/* DYNAMIC SPACING SLIDERS */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <span className="icon-badge">📐</span>
                  <h3>Advanced Spacing Controls</h3>
                </div>
                
                <div className="form-group-block" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label-title">Line Spacing / Density</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
                    {[
                      { id: 'dense', label: 'Dense' },
                      { id: 'regular', label: 'Regular' },
                      { id: 'loose', label: 'Spacious' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => updateCustomization('lineSpacing', mode.id)}
                        className="btn-control btn-control-secondary btn-control-small"
                        style={{
                          backgroundColor: resumeData.customization.lineSpacing === mode.id ? '#0f172a' : '#ffffff',
                          color: resumeData.customization.lineSpacing === mode.id ? '#ffffff' : '#475569',
                          border: resumeData.customization.lineSpacing === mode.id ? 'none' : '1px solid #cbd5e1'
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group-block" style={{ margin: 0 }}>
                  <label className="form-label-title">Sheet Side Margins</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
                    {[
                      { id: 'compact', label: 'Narrow' },
                      { id: 'comfortable', label: 'Standard' },
                      { id: 'wide', label: 'Wide' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => updateCustomization('margins', mode.id)}
                        className="btn-control btn-control-secondary btn-control-small"
                        style={{
                          backgroundColor: resumeData.customization.margins === mode.id ? '#0f172a' : '#ffffff',
                          color: resumeData.customization.margins === mode.id ? '#ffffff' : '#475569',
                          border: resumeData.customization.margins === mode.id ? 'none' : '1px solid #cbd5e1'
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* HEADER ALIGNMENT */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <span className="icon-badge">📏</span>
                  <h3>Header Alignment</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {['left', 'center'].map((alignment) => (
                    <button
                      key={alignment}
                      onClick={() => updateCustomization('headerAlignment', alignment)}
                      className="btn-control btn-control-secondary btn-control-small"
                      style={{
                        backgroundColor: resumeData.customization.headerAlignment === alignment ? '#0f172a' : '#ffffff',
                        color: resumeData.customization.headerAlignment === alignment ? '#ffffff' : '#334155',
                        border: resumeData.customization.headerAlignment === alignment ? 'none' : '1px solid #cbd5e1'
                      }}
                    >
                      {alignment === 'left' ? 'Left Aligned' : 'Centered'}
                    </button>
                  ))}
                </div>
              </div>

              {/* DETAILS ARRANGEMENT */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <span className="icon-badge">⛓️</span>
                  <h3>Details Arrangement</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { id: 'icon', label: 'Icon Layout' },
                    { id: 'bullet', label: 'Bullet Point' },
                    { id: 'pipe', label: 'Pipe Divider ( | )' },
                    { id: 'bar', label: 'Vertical Bar ( ┃ )' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => updateCustomization('detailsArrangement', mode.id)}
                      className="btn-control btn-control-secondary btn-control-small"
                      style={{
                        backgroundColor: resumeData.customization.detailsArrangement === mode.id ? '#0f172a' : '#ffffff',
                        color: resumeData.customization.detailsArrangement === mode.id ? '#ffffff' : '#334155',
                        border: resumeData.customization.detailsArrangement === mode.id ? 'none' : '1px solid #cbd5e1'
                      }}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ICON FRAMING */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <span className="icon-badge">🛡️</span>
                  <h3>Icon Style Frame</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { id: 'none', label: 'No Frame' },
                    { id: 'circle_filled', label: 'Circle Filled' },
                    { id: 'rounded_filled', label: 'Rounded Filled' },
                    { id: 'square_filled', label: 'Square Filled' },
                    { id: 'circle_outline', label: 'Circle Outline' },
                    { id: 'rounded_outline', label: 'Rounded Outline' },
                    { id: 'square_outline', label: 'Square Outline' }
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => updateCustomization('iconStyle', style.id)}
                      className="btn-control btn-control-secondary btn-control-small"
                      style={{
                        backgroundColor: resumeData.customization.iconStyle === style.id ? '#0f172a' : '#ffffff',
                        color: resumeData.customization.iconStyle === style.id ? '#ffffff' : '#334155',
                        border: resumeData.customization.iconStyle === style.id ? 'none' : '1px solid #cbd5e1'
                      }}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* TYPOGRAPHY FAMILY */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <span className="icon-badge">✍️</span>
                  <h3>Typography Settings</h3>
                </div>
                <div className="form-grid-row">
                  <div className="form-group-block">
                    <label className="form-label-title">Font Category</label>
                    <select
                      value={resumeData.customization.fontFamily}
                      onChange={(e) => updateCustomization('fontFamily', e.target.value)}
                      className="form-field-input"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <option value="body">Sans-Serif (Standard)</option>
                      <option value="creative">Serif (Creative Georgia)</option>
                      <option value="serif">Serif Elegant (Playfair Display)</option>
                      <option value="mono">Monospace (Courier New)</option>
                      <option value="sans">Clean Modern (Roboto)</option>
                      <option value="editorial">Classic Editorial (Lora)</option>
                    </select>
                  </div>
                  <div className="form-group-block">
                    <label className="form-label-title">Title Text Weight</label>
                    <select
                      value={resumeData.customization.nameStyle}
                      onChange={(e) => updateCustomization('nameStyle', e.target.value)}
                      className="form-field-input"
                      style={{ fontSize: '0.8rem' }}
                    >
                      <option value="bold">Bold Uppercase Headers</option>
                      <option value="semibold">Semibold Classic Headers</option>
                      <option value="normal">Classic Normal Weight</option>
                      <option value="italic">Elegant Italic Headers</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* 2. RIGHT PANEL: LIVE SHEET DISPLAY (Occupies full space if isPreviewMode is active) */}
      <div className="preview-container-workspace" style={{ 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        overflowY: 'auto',
        height: '100%',
        paddingBottom: '4rem',
        width: '100%'
      }}>
        
        {/* FLOATING ZOOM & PREVIEW TOGGLE CONTROLS */}
        <div style={{
          position: 'sticky',
          top: '1rem',
          alignSelf: 'flex-end',
          marginRight: '1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #cbd5e1',
          borderRadius: '99px',
          padding: '0.4rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
          zIndex: 50
        }}>
          {/* Dedicated mode swap toggle button to reveal or collapse edit cards */}
          <button 
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            style={{
              background: isPreviewMode ? '#7C3AED' : '#f1f5f9',
              color: isPreviewMode ? '#ffffff' : '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '99px',
              padding: '0.25rem 0.75rem',
              fontSize: '0.74rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{isPreviewMode ? '✏️ Edit Resume' : '👁️ Full Preview'}</span>
          </button>

          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#475569' }}>🔍 ZOOM: {Math.round(zoom * 100)}%</span>
          <input 
            type="range" 
            min="0.70" 
            max="1.15" 
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            style={{ width: '80px', cursor: 'pointer' }}
          />
          <button 
            onClick={() => setZoom(0.85)} 
            style={{ background: '#f1f5f9', border: 'none', padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '700', cursor: 'pointer' }}
          >
            Reset
          </button>
        </div>

        {/* Dynamic Scaling Frame Wrapper */}
        <div style={{ 
          transform: `scale(${zoom})`, 
          transformOrigin: 'top center',
          transition: 'transform 0.15s ease-out',
          marginTop: '2rem'
        }}>
          <ResumePreview />
        </div>
      </div>

      {/* FLOATING ACTION ALERTS */}
      {toast && toast.show && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            <span>
              {toast.type === 'success' && '✓ '}
              {toast.type === 'danger' && '⚠ '}
              {toast.type === 'info' && 'ℹ '}
              {toast.message}
            </span>
          </div>
        </div>
      )}

      {/* 3. SAAS DRAFT PREVIEW MODAL */}
      {showDraftModal && (
        <div 
          onClick={() => setShowDraftModal(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '2rem'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '80vh',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LucideIcons.Code />
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Document Draft Data Manifest</h3>
              </div>
              <button 
                onClick={() => setShowDraftModal(false)}
                style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            {/* Content body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: '#f8fafc' }}>
              <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.45' }}>
                Below is the raw workspace data manifest representing your current active document. You can copy this data block to back up your progress manually or diagnostic parsing.
              </p>
              <pre style={{
                margin: 0,
                padding: '1.25rem',
                backgroundColor: '#0f172a',
                color: '#38bdf8',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                lineHeight: '1.5',
                textAlign: 'left'
              }}>
                {JSON.stringify(resumeData, null, 2)}
              </pre>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', backgroundColor: '#ffffff' }}>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(resumeData, null, 2));
                  showNotification('Draft JSON copied to clipboard!', 'success');
                }}
                className="premium-btn"
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.8rem', borderRadius: '8px' }}
              >
                📋 Copy Code Draft
              </button>
              <button 
                onClick={() => setShowDraftModal(false)}
                style={{ padding: '0.55rem 1.25rem', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f1f5f9', cursor: 'pointer', color: '#475569', fontWeight: '700' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}