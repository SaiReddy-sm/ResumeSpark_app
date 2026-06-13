import React, { useContext, useState } from 'react';
import { ResumeContext } from '../context/ResumeContext';

export default function ResumeForm() {
  const {
    resumeData,
    updatePersonalInfo,
    updateSectionHeading, // For renaming section titles
    addSkill,
    removeSkill,
    addEducation,
    removeEducation,
    addExperience,
    removeExperience,
    addCustomSection,
    removeCustomSection,
    showNotification,
    // Destructured context bindings
    addLanguage,
    removeLanguage,
    addInterest,
    removeInterest,
    addAchievement,
    removeAchievement
  } = useContext(ResumeContext);

  const { personalInfo } = resumeData;

  // Local state for draft inputs
  const [skillInput, setSkillInput] = useState('');
  const [eduDraft, setEduDraft] = useState({ degree: '', school: '', year: '', marks: '' });
  const [expDraft, setExpDraft] = useState({ title: '', organization: '', duration: '', description: '' });
  const [customDraft, setCustomDraft] = useState({ title: '', content: '' });
  
  // New draft states for Languages, Interests, and Achievements
  const [langDraft, setLangDraft] = useState({ name: '', level: 'Intermediate' });
  const [interestInput, setInterestInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');

  // Drag and Drop state for Photo upload
  const [isDragging, setIsDragging] = useState(false);

  // Accordion active sub-sections
  const [activeAccordion, setActiveAccordion] = useState('personal'); 

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

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handlePhotoClear = () => {
    updatePersonalInfo('image', '');
    showNotification('Photo removed');
  };

  const handleSkillSubmit = (e) => {
    e.preventDefault();
    if (skillInput.trim()) {
      addSkill(skillInput);
      setSkillInput('');
    }
  };

  const handleLanguageSubmit = (e) => {
    e.preventDefault();
    if (langDraft.name.trim()) {
      if (addLanguage) {
        addLanguage(langDraft);
      } else {
        showNotification('Language Context method not detected', 'danger');
      }
      setLangDraft({ name: '', level: 'Intermediate' });
    }
  };

  const handleInterestSubmit = (e) => {
    e.preventDefault();
    if (interestInput.trim()) {
      if (addInterest) {
        addInterest(interestInput.trim());
      } else {
        showNotification('Interest Context method not detected', 'danger');
      }
      setInterestInput('');
    }
  };

  const handleAchievementSubmit = (e) => {
    e.preventDefault();
    if (achievementInput.trim()) {
      if (addAchievement) {
        addAchievement(achievementInput.trim());
      } else {
        showNotification('Achievement Context method not detected', 'danger');
      }
      setAchievementInput('');
    }
  };

  const handleEduSubmit = (e) => {
    e.preventDefault();
    if (!eduDraft.degree || !eduDraft.school) {
      showNotification('Degree and School are required', 'danger');
      return;
    }
    addEducation(eduDraft);
    setEduDraft({ degree: '', school: '', year: '', marks: '' });
  };

  const handleExpSubmit = (e) => {
    e.preventDefault();
    if (!expDraft.title || !expDraft.organization) {
      showNotification('Job Title and Company are required', 'danger');
      return;
    }
    addExperience(expDraft);
    setExpDraft({ title: '', organization: '', duration: '', description: '' });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customDraft.title || !customDraft.content) {
      showNotification('Section Title and Content are required', 'danger');
      return;
    }
    addCustomSection(customDraft);
    setCustomDraft({ title: '', content: '' });
  };

  const toggleMoreFields = () => {
    updatePersonalInfo('showMoreFields', !personalInfo.showMoreFields);
  };

  const fluencyLevels = ['Beginner', 'Intermediate', 'Fluent', 'Native'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* 1. PERSONAL DETAILS SECTION */}
      <div className="form-section-card" style={{ padding: activeAccordion === 'personal' ? '1.5rem' : '1rem 1.5rem' }}>
        <div 
          onClick={() => setActiveAccordion(activeAccordion === 'personal' ? '' : 'personal')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div className="form-section-header" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
            <span className="icon-badge">👤</span>
            <h3>Personal Details</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{activeAccordion === 'personal' ? '▲' : '▼'}</span>
        </div>

        {activeAccordion === 'personal' && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
            
            {/* Custom Heading renaming option */}
            <div className="form-group-block" style={{ marginBottom: '1.25rem', borderBottom: '1.5px dashed #e2e8f0', paddingBottom: '0.75rem' }}>
              <label className="form-label-title" style={{ fontSize: '0.72rem', color: '#4f46e5', fontWeight: 'bold' }}>Section Heading Title</label>
              <input 
                type="text"
                className="form-field-input"
                style={{ fontSize: '0.8rem', height: '32px' }}
                value={resumeData.customization?.sectionHeadings?.summary || 'Professional Summary'}
                onChange={(e) => updateSectionHeading('summary', e.target.value)}
                placeholder="Rename heading e.g. Summary"
              />
            </div>

            <div className="form-group-block">
              <label className="form-label-title">Full name</label>
              <input 
                type="text"
                className="form-field-input"
                value={personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                placeholder="Enter your title, first- and last name"
              />
            </div>

            <div className="form-group-block">
              <label className="form-label-title">Professional title</label>
              <input 
                type="text"
                className="form-field-input"
                value={personalInfo.title}
                onChange={(e) => updatePersonalInfo('title', e.target.value)}
                placeholder="Target position or current role"
              />
            </div>

            {/* Photo upload block with Drag & Drop */}
            <div className="form-group-block" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label-title">Photo (Drag & Drop or Upload)</label>
              <div className="form-avatar-flexbox">
                <div 
                  className={`form-avatar-frame ${isDragging ? 'dragging' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: isDragging ? '2px dashed #4f46e5' : '1px solid #e2e8f0',
                    backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.05)' : '#ffffff',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                  }}
                >
                  {personalInfo.image ? (
                    <img src={personalInfo.image} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '0.65rem', color: '#64748b', padding: '4px' }}>
                      {isDragging ? 'Drop Image Here' : 'Drag & Drop Here'}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ fontSize: '0.75rem' }} />
                  {personalInfo.image && (
                    <button type="button" className="btn-control btn-control-danger btn-control-small" onClick={handlePhotoClear} style={{ alignSelf: 'flex-start' }}>
                      Clear Image
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="form-grid-row">
              <div className="form-group-block">
                <label className="form-label-title">Email</label>
                <input 
                  type="email"
                  className="form-field-input"
                  value={personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group-block">
                <label className="form-label-title">Phone</label>
                <input 
                  type="text"
                  className="form-field-input"
                  value={personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="Enter Phone"
                />
              </div>
            </div>

            <div className="form-group-block">
              <label className="form-label-title">Location</label>
              <input 
                type="text"
                className="form-field-input"
                value={personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>

            <div className="form-group-block">
              <label className="form-label-title">Professional Summary</label>
              <textarea 
                className="form-field-textarea"
                rows="4"
                value={personalInfo.summary}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                placeholder="Brief summary of achievements, technical skills, or paste your rough description..."
              />
            </div>

            {/* COLLAPSIBLE ADD DETAILS BLOCK */}
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <button 
                type="button"
                onClick={toggleMoreFields}
                className="btn-control btn-control-secondary btn-control-small"
                style={{ width: '100%', marginBottom: '1rem', fontWeight: '700' }}
              >
                {personalInfo.showMoreFields ? 'Hide Details' : 'Add details (LinkedIn, Website, etc.)'}
              </button>

              {personalInfo.showMoreFields && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', animation: 'fadeIn 0.25s' }}>
                  <div className="form-grid-row">
                    <div className="form-group-block">
                      <label className="form-label-title">LinkedIn Link</label>
                      <input 
                        type="text"
                        className="form-field-input"
                        value={personalInfo.linkedin || ''}
                        onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                    <div className="form-group-block">
                      <label className="form-label-title">Website Link</label>
                      <input 
                        type="text"
                        className="form-field-input"
                        value={personalInfo.website || ''}
                        onChange={(e) => updatePersonalInfo('website', e.target.value)}
                        placeholder="portfolio.com"
                      />
                    </div>
                  </div>

                  <div className="form-grid-row">
                    <div className="form-group-block">
                      <label className="form-label-title">Nationality</label>
                      <input 
                        type="text"
                        className="form-field-input"
                        value={personalInfo.nationality || ''}
                        onChange={(e) => updatePersonalInfo('nationality', e.target.value)}
                        placeholder="e.g. Indian"
                      />
                    </div>
                    <div className="form-group-block">
                      <label className="form-label-title">Date of Birth</label>
                      <input 
                        type="text"
                        className="form-field-input"
                        value={personalInfo.dob || ''}
                        onChange={(e) => updatePersonalInfo('dob', e.target.value)}
                        placeholder="e.g. 15 Jan 2002"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button 
              type="button" 
              onClick={() => setActiveAccordion('')}
              className="btn-control btn-control-primary btn-control-small"
              style={{ width: '100%', marginTop: '1.25rem', padding: '0.5rem' }}
            >
              Done ✓
            </button>
          </div>
        )}
      </div>

      {/* 2. SKILLS & TOOLS SECTION */}
      <div className="form-section-card" style={{ padding: activeAccordion === 'skills' ? '1.5rem' : '1rem 1.5rem' }}>
        <div 
          onClick={() => setActiveAccordion(activeAccordion === 'skills' ? '' : 'skills')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div className="form-section-header" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
            <span className="icon-badge">🛠️</span>
            <h3>Skills & Tools</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{activeAccordion === 'skills' ? '▲' : '▼'}</span>
        </div>

        {activeAccordion === 'skills' && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            
            {/* Custom Heading renaming option */}
            <div className="form-group-block" style={{ marginBottom: '1.25rem', borderBottom: '1.5px dashed #e2e8f0', paddingBottom: '0.75rem' }}>
              <label className="form-label-title" style={{ fontSize: '0.72rem', color: '#4f46e5', fontWeight: 'bold' }}>Section Heading Title</label>
              <input 
                type="text"
                className="form-field-input"
                style={{ fontSize: '0.8rem', height: '32px' }}
                value={resumeData.customization?.sectionHeadings?.skills || 'Skills & Tools'}
                onChange={(e) => updateSectionHeading('skills', e.target.value)}
                placeholder="Rename heading e.g. Core Expertise"
              />
            </div>

            <form onSubmit={handleSkillSubmit} className="tag-input-row">
              <input 
                type="text"
                className="form-field-input"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="e.g. Figma (Type & press add)"
              />
              <button type="submit" className="btn-control btn-control-primary">Add</button>
            </form>

            <div className="skills-wrapper-list">
              {resumeData.skills.length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No skills added yet.</span>
              ) : (
                resumeData.skills.map((s) => (
                  <span key={s} className="badge-tag-item">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)}>×</button>
                  </span>
                ))
              )}
            </div>

            <button 
              type="button" 
              onClick={() => setActiveAccordion('')}
              className="btn-control btn-control-primary btn-control-small"
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              Done ✓
            </button>
          </div>
        )}
      </div>

      {/* 3. LANGUAGES SECTION */}
      <div className="form-section-card" style={{ padding: activeAccordion === 'languages' ? '1.5rem' : '1rem 1.5rem' }}>
        <div 
          onClick={() => setActiveAccordion(activeAccordion === 'languages' ? '' : 'languages')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div className="form-section-header" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
            <span className="icon-badge">🌐</span>
            <h3>Languages</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{activeAccordion === 'languages' ? '▲' : '▼'}</span>
        </div>

        {activeAccordion === 'languages' && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            
            {/* Custom Heading renaming option */}
            <div className="form-group-block" style={{ marginBottom: '1.25rem', borderBottom: '1.5px dashed #e2e8f0', paddingBottom: '0.75rem' }}>
              <label className="form-label-title" style={{ fontSize: '0.72rem', color: '#4f46e5', fontWeight: 'bold' }}>Section Heading Title</label>
              <input 
                type="text"
                className="form-field-input"
                style={{ fontSize: '0.8rem', height: '32px' }}
                value={resumeData.customization?.sectionHeadings?.languages || 'Languages'}
                onChange={(e) => updateSectionHeading('languages', e.target.value)}
                placeholder="Rename heading e.g. Languages Spoken"
              />
            </div>

            <form onSubmit={handleLanguageSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="tag-input-row" style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text"
                  className="form-field-input"
                  value={langDraft.name}
                  onChange={(e) => setLangDraft({ ...langDraft, name: e.target.value })}
                  placeholder="e.g. English, French, Spanish"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn-control btn-control-primary">Add</button>
              </div>

              {/* Fluency Level Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 'bold' }}>Fluency Level:</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {fluencyLevels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setLangDraft({ ...langDraft, level })}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: langDraft.level === level ? '#4f46e5' : '#e2e8f0',
                        backgroundColor: langDraft.level === level ? '#f5f3ff' : '#ffffff',
                        color: langDraft.level === level ? '#4f46e5' : '#64748b',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* List of Added Languages */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1.25rem' }}>
              {!resumeData.languages || resumeData.languages.length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No languages added yet.</span>
              ) : (
                resumeData.languages.map((lang, index) => (
                  <div 
                    key={lang.id || index} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.5rem 0.75rem', 
                      background: '#f8fafc', 
                      border: '1px solid #f1f5f9', 
                      borderRadius: '8px' 
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#334155' }}>
                      {lang.name} <span style={{ fontWeight: '400', color: '#64748b', fontSize: '0.75rem' }}>({lang.level})</span>
                    </span>
                    <button 
                      type="button" 
                      onClick={() => removeLanguage && removeLanguage(lang.id || lang.name)}
                      style={{ 
                        border: 'none', 
                        background: 'transparent', 
                        color: '#ef4444', 
                        cursor: 'pointer', 
                        fontSize: '1rem',
                        padding: '0 4px'
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            <button 
              type="button" 
              onClick={() => setActiveAccordion('')}
              className="btn-control btn-control-primary btn-control-small"
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              Done ✓
            </button>
          </div>
        )}
      </div>

      {/* 4. EDUCATION SECTION */}
      <div className="form-section-card" style={{ padding: activeAccordion === 'education' ? '1.5rem' : '1rem 1.5rem' }}>
        <div 
          onClick={() => setActiveAccordion(activeAccordion === 'education' ? '' : 'education')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div className="form-section-header" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
            <span className="icon-badge">📖</span>
            <h3>Education History</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{activeAccordion === 'education' ? '▲' : '▼'}</span>
        </div>

        {activeAccordion === 'education' && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            
            {/* Custom Heading renaming option */}
            <div className="form-group-block" style={{ marginBottom: '1.25rem', borderBottom: '1.5px dashed #e2e8f0', paddingBottom: '0.75rem' }}>
              <label className="form-label-title" style={{ fontSize: '0.72rem', color: '#4f46e5', fontWeight: 'bold' }}>Section Heading Title</label>
              <input 
                type="text"
                className="form-field-input"
                style={{ fontSize: '0.8rem', height: '32px' }}
                value={resumeData.customization?.sectionHeadings?.education || 'Education History'}
                onChange={(e) => updateSectionHeading('education', e.target.value)}
                placeholder="Rename heading e.g. Academic History"
              />
            </div>

            {resumeData.education.map((edu) => (
              <div key={edu.id} className="repeater-card-entry" style={{ paddingRight: '4.5rem' }}>
                <button 
                  type="button" 
                  className="btn-control btn-control-danger btn-control-small"
                  onClick={() => removeEducation(edu.id)}
                  style={{ position: 'absolute', right: '10px', top: '10px' }}
                >
                  Remove
                </button>
                <div className="repeater-card-title">{edu.degree}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{edu.school} ({edu.year})</div>
                {edu.marks && <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Grade: {edu.marks}</div>}
              </div>
            ))}

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div className="form-grid-row">
                <div className="form-group-block">
                  <label className="form-label-title">Degree / Certificate</label>
                  <input 
                    type="text"
                    className="form-field-input"
                    value={eduDraft.degree}
                    onChange={(e) => setEduDraft({ ...eduDraft, degree: e.target.value })}
                    placeholder="e.g. B.Tech CS"
                  />
                </div>
                <div className="form-group-block">
                  <label className="form-label-title">School / University</label>
                  <input 
                    type="text"
                    className="form-field-input"
                    value={eduDraft.school}
                    onChange={(e) => setEduDraft({ ...eduDraft, school: e.target.value })}
                    placeholder="e.g. NIT College"
                  />
                </div>
              </div>
              <div className="form-grid-row">
                <div className="form-group-block">
                  <label className="form-label-title">Duration / Year</label>
                  <input 
                    type="text"
                    className="form-field-input"
                    value={eduDraft.year}
                    onChange={(e) => setEduDraft({ ...eduDraft, year: e.target.value })}
                    placeholder="e.g. 2022 - 2026"
                  />
                </div>
                <div className="form-group-block">
                  <label className="form-label-title">Marks / Grade</label>
                  <input 
                    type="text"
                    className="form-field-input"
                    value={eduDraft.marks}
                    onChange={(e) => setEduDraft({ ...eduDraft, marks: e.target.value })}
                    placeholder="e.g. 9.4 CGPA"
                  />
                </div>
              </div>
              <button type="button" onClick={handleEduSubmit} className="btn-control btn-control-success" style={{ width: '100%', marginTop: '0.5rem' }}>
                + Add Education Block
              </button>
            </div>

            <button 
              type="button" 
              onClick={() => setActiveAccordion('')}
              className="btn-control btn-control-primary btn-control-small"
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              Done ✓
            </button>
          </div>
        )}
      </div>

      {/* 5. EXPERIENCE & PROJECTS */}
      <div className="form-section-card" style={{ padding: activeAccordion === 'experience' ? '1.5rem' : '1rem 1.5rem' }}>
        <div 
          onClick={() => setActiveAccordion(activeAccordion === 'experience' ? '' : 'experience')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div className="form-section-header" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
            <span className="icon-badge">💼</span>
            <h3>Experience & Projects</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{activeAccordion === 'experience' ? '▲' : '▼'}</span>
        </div>

        {activeAccordion === 'experience' && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            
            {/* Custom Heading renaming option */}
            <div className="form-group-block" style={{ marginBottom: '1.25rem', borderBottom: '1.5px dashed #e2e8f0', paddingBottom: '0.75rem' }}>
              <label className="form-label-title" style={{ fontSize: '0.72rem', color: '#4f46e5', fontWeight: 'bold' }}>Section Heading Title</label>
              <input 
                type="text"
                className="form-field-input"
                style={{ fontSize: '0.8rem', height: '32px' }}
                value={resumeData.customization?.sectionHeadings?.experience || 'Experience & Projects'}
                onChange={(e) => updateSectionHeading('experience', e.target.value)}
                placeholder="Rename heading e.g. Professional Experience"
              />
            </div>

            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="repeater-card-entry" style={{ paddingRight: '4.5rem' }}>
                <button 
                  type="button" 
                  className="btn-control btn-control-danger btn-control-small"
                  onClick={() => removeExperience(exp.id)}
                  style={{ position: 'absolute', right: '10px', top: '10px' }}
                >
                  Remove
                </button>
                <div className="repeater-card-title">{exp.title}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{exp.organization} ({exp.duration})</div>
                {exp.description && <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>{exp.description}</p>}
              </div>
            ))}

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div className="form-grid-row">
                <div className="form-group-block">
                  <label className="form-label-title">Title / Role</label>
                  <input 
                    type="text"
                    className="form-field-input"
                    value={expDraft.title}
                    onChange={(e) => setExpDraft({ ...expDraft, title: e.target.value })}
                    placeholder="e.g. Frontend Developer Intern"
                  />
                </div>
                <div className="form-group-block">
                  <label className="form-label-title">Company / Platform</label>
                  <input 
                    type="text"
                    className="form-field-input"
                    value={expDraft.organization}
                    onChange={(e) => setExpDraft({ ...expDraft, organization: e.target.value })}
                    placeholder="e.g. GrowthLoop Software"
                  />
                </div>
              </div>
              <div className="form-group-block">
                <label className="form-label-title">Duration / Dates</label>
                <input 
                  type="text"
                  className="form-field-input"
                  value={expDraft.duration}
                  onChange={(e) => setExpDraft({ ...expDraft, duration: e.target.value })}
                  placeholder="e.g. May 2025 - July 2025"
                />
              </div>
              <div className="form-group-block">
                <label className="form-label-title">Description / Key Deliverables</label>
                <textarea 
                  className="form-field-textarea"
                  rows="3"
                  value={expDraft.description}
                  onChange={(e) => setExpDraft({ ...expDraft, description: e.target.value })}
                  placeholder="Summarize key tasks, languages used, and product metrics achieved..."
                />
              </div>
              <button type="button" onClick={handleExpSubmit} className="btn-control btn-control-success" style={{ width: '100%', marginTop: '0.5rem' }}>
                + Add Work Block
              </button>
            </div>

            <button 
              type="button" 
              onClick={() => setActiveAccordion('')}
              className="btn-control btn-control-primary btn-control-small"
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              Done ✓
            </button>
          </div>
        )}
      </div>

      {/* 6. ACHIEVEMENTS SECTION */}
      <div className="form-section-card" style={{ padding: activeAccordion === 'achievements' ? '1.5rem' : '1rem 1.5rem' }}>
        <div 
          onClick={() => setActiveAccordion(activeAccordion === 'achievements' ? '' : 'achievements')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div className="form-section-header" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
            <span className="icon-badge">🏆</span>
            <h3>Achievements</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{activeAccordion === 'achievements' ? '▲' : '▼'}</span>
        </div>

        {activeAccordion === 'achievements' && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            
            {/* Custom Heading renaming option */}
            <div className="form-group-block" style={{ marginBottom: '1.25rem', borderBottom: '1.5px dashed #e2e8f0', paddingBottom: '0.75rem' }}>
              <label className="form-label-title" style={{ fontSize: '0.72rem', color: '#4f46e5', fontWeight: 'bold' }}>Section Heading Title</label>
              <input 
                type="text"
                className="form-field-input"
                style={{ fontSize: '0.8rem', height: '32px' }}
                value={resumeData.customization?.sectionHeadings?.achievements || 'Achievements'}
                onChange={(e) => updateSectionHeading('achievements', e.target.value)}
                placeholder="Rename heading e.g. Milestones"
              />
            </div>

            <form onSubmit={handleAchievementSubmit} className="tag-input-row">
              <input 
                type="text"
                className="form-field-input"
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                placeholder="e.g. 1st Place in Local Hackathon"
              />
              <button type="submit" className="btn-control btn-control-primary">Add</button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              {!resumeData.achievements || resumeData.achievements.length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No achievements added yet.</span>
              ) : (
                resumeData.achievements.map((ach, index) => {
                  const displayVal = typeof ach === 'object' ? ach.name : ach;
                  const itemKey = typeof ach === 'object' ? (ach.id || index) : index;
                  return (
                    <div 
                      key={itemKey} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '0.5rem 0.75rem', 
                        background: '#f8fafc', 
                        border: '1px solid #f1f5f9', 
                        borderRadius: '8px' 
                      }}
                    >
                      <span style={{ fontSize: '0.8rem', color: '#334155' }}>{displayVal}</span>
                      <button 
                        type="button" 
                        onClick={() => removeAchievement && removeAchievement(ach.id || ach)}
                        style={{ 
                          border: 'none', 
                          background: 'transparent', 
                          color: '#ef4444', 
                          cursor: 'pointer', 
                          fontSize: '1rem' 
                        }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <button 
              type="button" 
              onClick={() => setActiveAccordion('')}
              className="btn-control btn-control-primary btn-control-small"
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              Done ✓
            </button>
          </div>
        )}
      </div>

      {/* 7. INTERESTS SECTION */}
      <div className="form-section-card" style={{ padding: activeAccordion === 'interests' ? '1.5rem' : '1rem 1.5rem' }}>
        <div 
          onClick={() => setActiveAccordion(activeAccordion === 'interests' ? '' : 'interests')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div className="form-section-header" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
            <span className="icon-badge">🎨</span>
            <h3>Interests</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{activeAccordion === 'interests' ? '▲' : '▼'}</span>
        </div>

        {activeAccordion === 'interests' && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            
            {/* Custom Heading renaming option */}
            <div className="form-group-block" style={{ marginBottom: '1.25rem', borderBottom: '1.5px dashed #e2e8f0', paddingBottom: '0.75rem' }}>
              <label className="form-label-title" style={{ fontSize: '0.72rem', color: '#4f46e5', fontWeight: 'bold' }}>Section Heading Title</label>
              <input 
                type="text"
                className="form-field-input"
                style={{ fontSize: '0.8rem', height: '32px' }}
                value={resumeData.customization?.sectionHeadings?.interests || 'Interests'}
                onChange={(e) => updateSectionHeading('interests', e.target.value)}
                placeholder="Rename heading e.g. Hobbies"
              />
            </div>

            <form onSubmit={handleInterestSubmit} className="tag-input-row">
              <input 
                type="text"
                className="form-field-input"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                placeholder="e.g. Open Source, UI/UX, Hiking"
              />
              <button type="submit" className="btn-control btn-control-primary">Add</button>
            </form>

            <div className="skills-wrapper-list">
              {!resumeData.interests || resumeData.interests.length === 0 ? (
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>No interests added yet.</span>
              ) : (
                resumeData.interests.map((interest, index) => {
                  const displayVal = typeof interest === 'object' ? interest.name : interest;
                  return (
                    <span key={index} className="badge-tag-item">
                      {displayVal}
                      <button type="button" onClick={() => removeInterest && removeInterest(interest)}>×</button>
                    </span>
                  );
                })
              )}
            </div>

            <button 
              type="button" 
              onClick={() => setActiveAccordion('')}
              className="btn-control btn-control-primary btn-control-small"
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              Done ✓
            </button>
          </div>
        )}
      </div>

      {/* 8. CUSTOM SECTIONS */}
      <div className="form-section-card" style={{ padding: activeAccordion === 'custom' ? '1.5rem' : '1rem 1.5rem' }}>
        <div 
          onClick={() => setActiveAccordion(activeAccordion === 'custom' ? '' : 'custom')}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        >
          <div className="form-section-header" style={{ borderBottom: 'none', margin: 0, padding: 0 }}>
            <span className="icon-badge">📋</span>
            <h3>Custom Sections</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{activeAccordion === 'custom' ? '▲' : '▼'}</span>
        </div>

        {activeAccordion === 'custom' && (
          <div style={{ marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
            {resumeData.customSections.map((sec) => (
              <div key={sec.id} className="repeater-card-entry" style={{ paddingRight: '4.5rem' }}>
                <button 
                  type="button" 
                  className="btn-control btn-control-danger btn-control-small"
                  onClick={() => removeCustomSection(sec.id)}
                  style={{ position: 'absolute', right: '10px', top: '10px' }}
                >
                  Remove
                </button>
                <div className="repeater-card-title">{sec.title}</div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'pre-line' }}>{sec.content}</p>
              </div>
            ))}

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div className="form-group-block">
                <label className="form-label-title">Custom Section Title</label>
                <input 
                  type="text"
                  className="form-field-input"
                  value={customDraft.title}
                  onChange={(e) => setCustomDraft({ ...customDraft, title: e.target.value })}
                  placeholder="e.g. Certifications or Achievements"
                />
              </div>
              <div className="form-group-block">
                <label className="form-label-title">Custom Section Content</label>
                <textarea 
                  className="form-field-textarea"
                  rows="3"
                  value={customDraft.content}
                  onChange={(e) => setCustomDraft({ ...customDraft, content: e.target.value })}
                  placeholder="• Certified Scrum Master (2025)&#10;• 1st prize in hackathon (2024)"
                />
              </div>
              <button type="button" onClick={handleCustomSubmit} className="btn-control btn-control-success" style={{ width: '100%', marginTop: '0.5rem' }}>
                + Add Custom Block
              </button>
            </div>

            <button 
              type="button" 
              onClick={() => setActiveAccordion('')}
              className="btn-control btn-control-primary btn-control-small"
              style={{ width: '100%', marginTop: '1.25rem' }}
            >
              Done ✓
            </button>
          </div>
        )}
      </div>

    </div>
  );
}