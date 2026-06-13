import React, { useContext } from 'react';
import { ResumeContext } from '../context/ResumeContext';
import '../styles/preview.css';
import '../templates/TemplateStyles.css';

// Master layout types mapping
const LAYOUT_TYPES = {
  // ATS
  ats_essential: 'single_column',
  classic_scholar: 'single_column',
  minimal_focus: 'single_column',
  clean_ats: 'single_column',
  ats_global: 'single_column',
  ats_corporate: 'single_column',
  ats_executive: 'single_column',

  // Professional
  corporate_prime: 'banner_header',
  elegant_serif: 'centered_serif',
  business_elite: 'single_column',
  executive_blue: 'banner_header',
  soft_pro: 'single_column',
  skyline_exec: 'single_column',
  vintage_elegance: 'centered_serif',

  // Modern (6 distinct side-grid/two-column split options)
  modern_edge: 'two_column',
  startup_clean: 'two_column',
  modern_split: 'two_column',
  modern_minimalist: 'timeline_column',
  designer_glow: 'two_column',
  academic_pro: 'two_column',
  creative_sidebar: 'two_column',

  // Creative
  creative_spark: 'banner_header',
  portfolio_plus: 'banner_header',
  bold_metro: 'banner_header',
  avant_garde: 'two_column',
  creative_curator: 'two_column',
  creative_minimal: 'two_column',

  // Student
  smart_graduate: 'single_column',
  tech_fresher: 'single_column'
};

const TEMPLATE_THEMES = {
  ats_essential: { font: "'Courier New', monospace", defaultColor: '#111827' },
  classic_scholar: { font: 'Georgia, serif', defaultColor: '#1e2e47' },
  minimal_focus: { font: "'Courier New', monospace", defaultColor: '#0f172a' },
  clean_ats: { font: "'Courier New', monospace", defaultColor: '#111827' },
  ats_global: { font: "'Courier New', monospace", defaultColor: '#111827' },
  ats_corporate: { font: "'Courier New', monospace", defaultColor: '#111827' },
  ats_executive: { font: "'Courier New', monospace", defaultColor: '#111827' },

  corporate_prime: { font: "'Inter', sans-serif", defaultColor: '#1e3a8a' },
  elegant_serif: { font: "Georgia, serif", defaultColor: '#7c2d12' },
  business_elite: { font: "'Inter', sans-serif", defaultColor: '#0284c7' },
  executive_blue: { font: "'Inter', sans-serif", defaultColor: '#2563eb' },
  soft_pro: { font: "'Inter', sans-serif", defaultColor: '#475569' },
  skyline_exec: { font: "'Inter', sans-serif", defaultColor: '#0f172a' },
  vintage_elegance: { font: "Georgia, serif", defaultColor: '#854d0e' },

  modern_edge: { font: "'Inter', sans-serif", defaultColor: '#6366f1' },
  startup_clean: { font: "'Inter', sans-serif", defaultColor: '#f97316' },
  modern_split: { font: "'Inter', sans-serif", defaultColor: '#1e2e47' },
  modern_minimalist: { font: "'Inter', sans-serif", defaultColor: '#0f172a' },
  designer_glow: { font: "'Inter', sans-serif", defaultColor: '#db2777' },
  academic_pro: { font: "'Inter', sans-serif", defaultColor: '#6d28d9' },
  creative_sidebar: { font: "'Inter', sans-serif", defaultColor: '#4f46e5' },

  creative_spark: { font: "'Inter', sans-serif", defaultColor: '#0d9488' },
  portfolio_plus: { font: "'Inter', sans-serif", defaultColor: '#a855f7' },
  bold_metro: { font: "'Inter', sans-serif", defaultColor: '#b91c1c' },
  avant_garde: { font: "'Inter', sans-serif", defaultColor: '#14b8a6' },
  creative_curator: { font: "'Inter', sans-serif", defaultColor: '#1e2e47' },
  creative_minimal: { font: "'Inter', sans-serif", defaultColor: '#1e2e47' },

  smart_graduate: { font: "'Inter', sans-serif", defaultColor: '#8b5cf6' },
  tech_fresher: { font: "'Inter', sans-serif", defaultColor: '#10b981' }
};

const icons = {
  email: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  phone: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  location: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  linkedin: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  website: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  id: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 13a3 3 0 0 0-6 0"/></svg>,
  calendar: <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
};

const FONT_MAP = {
  body: "'Inter', sans-serif",
  creative: "Georgia, serif",
  serif: "'Playfair Display', Georgia, serif",
  mono: "'Courier New', Courier, monospace",
  sans: "'Roboto', sans-serif",
  editorial: "'Lora', Georgia, serif"
};

export default function ResumePreview() {
  const { resumeData } = useContext(ResumeContext);
  const { personalInfo, skills, languages, education, experience, achievements, interests, customSections, template, enableSecondPage, customization } = resumeData;

  // Active Theme Mappings
  const themeMeta = TEMPLATE_THEMES[template] || TEMPLATE_THEMES.classic_scholar;
  const isATS = template.startsWith('ats_') || template === 'clean_ats' || template === 'minimal_focus';
  
  // Dynamic color assignments
  const accent = isATS ? '#111827' : (customization.accentColor || themeMeta.defaultColor);
  const resolvedFont = FONT_MAP[customization.fontFamily] || themeMeta.font;
  const layoutStyle = LAYOUT_TYPES[template] || 'single_column';
  
  // Compacted margins for height optimization
  const marginPadding = 
    customization.margins === 'compact' ? '10mm 11mm' : 
    customization.margins === 'wide' ? '20mm 22mm' : 
    '14mm 16mm';

  const resolvedLineHeight = 
    customization.lineSpacing === 'dense' ? '1.20' : 
    customization.lineSpacing === 'loose' ? '1.55' : 
    '1.38';

  const entryGap = 
    customization.lineSpacing === 'dense' ? '3px' : 
    customization.lineSpacing === 'loose' ? '9px' : 
    '6px';

  const sectionMarginBottom = 
    customization.lineSpacing === 'dense' ? '6px' : 
    customization.lineSpacing === 'loose' ? '15px' : 
    '10px';

  // Dynamic heading name retriever
  const getSectionHeading = (key, defaultHeading) => {
    return customization?.sectionHeadings?.[key] || defaultHeading;
  };

  const renderProfilePhoto = () => {
    if (isATS) return null;
    const imageUrl = personalInfo.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcvrxQX3uFKcjzgoS1GXTj8Nrqw2tLJTyCmA&s";
    const sizeDimension = customization.photoSize ? `${customization.photoSize}px` : '120px';

    return (
      <div style={{ width: sizeDimension, height: sizeDimension, overflow: 'hidden', display: 'inline-block', flexShrink: 0, borderRadius: (layoutStyle === 'centered_serif' || template === 'vintage_elegance') ? '0px' : '50%', border: `2px solid ${accent}`, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
        <img 
          src={imageUrl} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            objectPosition: 'center 15%' // Shifted position focus upward to capture passport faces correctly
          }}
          alt="Profile Avatar" 
        />
      </div>
    );
  };

  const applyIconStyleFrame = (svgElement) => {
    if (isATS) return null;
    const isFilled = customization.iconStyle.includes('filled');
    const isOutline = customization.iconStyle.includes('outline');
    const shapeClass = customization.iconStyle.includes('circle') ? '50%' : customization.iconStyle.includes('rounded') ? '4px' : '0';

    if (customization.iconStyle === 'none') {
      return <span style={{ color: accent, display: 'inline-flex', alignSelf: 'center' }}>{svgElement}</span>;
    }

    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        borderRadius: shapeClass,
        backgroundColor: isFilled ? accent : 'transparent',
        color: isFilled ? '#ffffff' : accent,
        border: isOutline ? `1.5px solid ${accent}` : 'none',
        fontSize: '0.65rem'
      }}>
        {svgElement}
      </span>
    );
  };

  const getContactFields = () => {
    return [
      { id: 'email', val: personalInfo.email, icon: icons.email },
      { id: 'phone', val: personalInfo.phone, icon: icons.phone },
      { id: 'location', val: personalInfo.location, icon: icons.location },
      { id: 'linkedin', val: personalInfo.linkedin, icon: icons.linkedin },
      { id: 'website', val: personalInfo.website, icon: icons.website },
      { id: 'nationality', val: personalInfo.nationality, icon: icons.id },
      { id: 'dob', val: personalInfo.dob, icon: icons.calendar }
    ].filter(f => f.val);
  };

  const renderContactBlock = (isInline = true) => {
    const fields = getContactFields();
    if (fields.length === 0) return null;

    if (!isInline) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '8pt', color: '#475569' }}>
          {fields.map(f => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {!isATS && applyIconStyleFrame(f.icon)}
              <span style={{ overflowWrap: 'anywhere' }}>{f.val}</span>
            </div>
          ))}
        </div>
      );
    }

    const arrange = isATS ? 'bullet' : customization.detailsArrangement;
    if (arrange === 'icon' && !isATS) {
      return (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px 12px',
          justifyContent: customization.headerAlignment === 'center' ? 'center' : 'flex-start',
          marginTop: '6px',
          fontSize: '7.8pt',
          color: '#475569'
        }}>
          {fields.map(f => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {applyIconStyleFrame(f.icon)}
              <span>{f.val}</span>
            </div>
          ))}
        </div>
      );
    }

    const divider = arrange === 'pipe' ? ' | ' : arrange === 'bar' ? ' ┃ ' : ' • ';
    return (
      <div style={{
        marginTop: '6px',
        fontSize: '7.8pt',
        color: '#475569',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: customization.headerAlignment === 'center' ? 'center' : 'flex-start',
        gap: '2px 6px'
      }}>
        {fields.map((f, idx) => (
          <span key={f.id}>
            <span>{f.val}</span>
            {idx < fields.length - 1 && <span style={{ color: accent, fontWeight: '700' }}>{divider}</span>}
          </span>
        ))}
      </div>
    );
  };

  const renderSummary = () => {
    if (!personalInfo.summary) return null;
    const titleText = getSectionHeading('summary', 'Professional Summary');
    return (
      <div key="summary" style={{ marginBottom: sectionMarginBottom }}>
        <h3 className="resume-section-title" style={{ color: accent, borderBottom: isATS ? '1px solid #111827' : `1.5px solid ${accent}40`, paddingBottom: '2px' }}>
          {titleText}
        </h3>
        <p style={{ fontSize: '8.2pt', color: '#334155', lineHeight: resolvedLineHeight, marginTop: '4px', textAlign: 'justify' }}>
          {personalInfo.summary}
        </p>
      </div>
    );
  };

  const renderExperience = () => {
    if (!experience || experience.length === 0) return null;
    const titleText = getSectionHeading('experience', 'Experience & Projects');
    return (
      <div key="experience" style={{ marginBottom: sectionMarginBottom }}>
        <h3 className="resume-section-title" style={{ color: accent, borderBottom: isATS ? '1px solid #111827' : `1.5px solid ${accent}40`, paddingBottom: '2px' }}>
          {titleText}
        </h3>
        
        {layoutStyle === 'timeline_column' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: `2.5px solid ${accent}`, paddingLeft: '14px', marginLeft: '6px', marginTop: '6px' }}>
            {experience.map((exp) => (
              <div key={exp.id} style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: accent, left: '-19.5px', top: '5px', border: '2px solid #ffffff' }} />
                <div className="resume-entry-header" style={{ fontSize: '8.8pt' }}>
                  <span style={{ color: accent, fontWeight: '700' }}>{exp.title}</span>
                  <span style={{ fontSize: '7.8pt', color: '#64748b' }}>{exp.duration}</span>
                </div>
                <div style={{ fontSize: '8.2pt', fontWeight: '600', color: '#475569' }}>{exp.organization}</div>
                {exp.description && <p className="resume-entry-desc" style={{ lineHeight: resolvedLineHeight, fontSize: '8pt', color: '#334155' }}>{exp.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="resume-grid-entries" style={{ marginTop: '4px', gap: entryGap }}>
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="resume-entry-header" style={{ fontSize: '8.8pt' }}>
                  <span style={{ color: accent, fontWeight: '700' }}>{exp.title}</span>
                  <span style={{ fontSize: '7.8pt', color: '#64748b' }}>{exp.duration}</span>
                </div>
                <div className="resume-entry-sub" style={{ fontSize: '8.2pt' }}>
                  <span style={{ fontWeight: '600' }}>{exp.organization}</span>
                </div>
                {exp.description && <p className="resume-entry-desc" style={{ lineHeight: resolvedLineHeight, fontSize: '8pt', color: '#475569' }}>{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderEducation = () => {
    if (!education || education.length === 0) return null;
    const titleText = getSectionHeading('education', 'Education History');
    return (
      <div key="education" style={{ marginBottom: sectionMarginBottom }}>
        <h3 className="resume-section-title" style={{ color: accent, borderBottom: isATS ? '1px solid #111827' : `1.5px solid ${accent}40`, paddingBottom: '2px' }}>
          {titleText}
        </h3>
        <div className="resume-grid-entries" style={{ marginTop: '4px', gap: entryGap }}>
          {education.map((edu) => (
            <div key={edu.id}>
              <div className="resume-entry-header" style={{ fontSize: '8.8pt' }}>
                <span style={{ color: accent, fontWeight: '700' }}>{edu.degree}</span>
                <span style={{ fontSize: '7.8pt', color: '#64748b' }}>{edu.year}</span>
              </div>
              <div className="resume-entry-sub" style={{ fontSize: '8.2pt' }}>
                <span>{edu.school}</span>
                {edu.marks && <span style={{ fontWeight: '600', marginLeft: '6px' }}>Grade: {edu.marks}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null;
    const titleText = getSectionHeading('skills', 'Skills & Tools');
    return (
      <div key="skills" style={{ marginBottom: sectionMarginBottom }}>
        <h3 className="resume-section-title" style={{ color: accent, borderBottom: isATS ? '1px solid #111827' : `1.5px solid ${accent}40`, paddingBottom: '2px' }}>
          {titleText}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
          {skills.map((s, idx) => (
            <span 
              key={idx} 
              style={{ 
                backgroundColor: isATS ? 'transparent' : `${accent}09`, 
                color: accent,
                padding: isATS ? '0' : '2px 7px', 
                borderRadius: '4px', 
                fontSize: '7.5pt', 
                fontWeight: '600',
                border: isATS ? 'none' : `1px solid ${accent}18`
              }}
            >
              {s}{isATS && idx < skills.length - 1 ? ',' : ''}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderLanguages = () => {
    if (!languages || languages.length === 0) return null;
    const titleText = getSectionHeading('languages', 'Languages');
    return (
      <div key="languages" style={{ marginBottom: sectionMarginBottom }}>
        <h3 className="resume-section-title" style={{ color: accent, borderBottom: isATS ? '1px solid #111827' : `1.5px solid ${accent}40`, paddingBottom: '2px' }}>
          {titleText}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
          {languages.map((lang, idx) => (
            <span key={lang.id || idx} style={{ fontSize: '8pt', color: '#334155' }}>
              <strong style={{ color: accent }}>{lang.name}</strong> <span style={{ color: '#64748b' }}>({lang.level})</span>
              {idx < languages.length - 1 ? '  •  ' : ''}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    if (!achievements || achievements.length === 0) return null;
    const titleText = getSectionHeading('achievements', 'Achievements');
    return (
      <div key="achievements" style={{ marginBottom: sectionMarginBottom }}>
        <h3 className="resume-section-title" style={{ color: accent, borderBottom: isATS ? '1px solid #111827' : `1.5px solid ${accent}40`, paddingBottom: '2px' }}>
          {titleText}
        </h3>
        <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', fontSize: '8pt', color: '#475569', lineHeight: resolvedLineHeight }}>
          {achievements.map((ach, idx) => {
            const displayVal = typeof ach === 'object' ? ach.name : ach;
            return (
              <li key={ach.id || idx} style={{ marginBottom: '3px' }}>
                {displayVal}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const renderInterests = () => {
    const ints = interests || [];
    if (ints.length === 0) return null;
    const titleText = getSectionHeading('interests', 'Interests');
    return (
      <div key="interests" style={{ marginBottom: sectionMarginBottom }}>
        <h3 className="resume-section-title" style={{ color: accent, borderBottom: isATS ? '1px solid #111827' : `1.5px solid ${accent}40`, paddingBottom: '2px' }}>
          {titleText}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
          {ints.map((interest, idx) => {
            const displayVal = typeof interest === 'object' ? interest.name : interest;
            return (
              <span key={idx} style={{ 
                fontSize: '7.5pt', 
                color: '#475569', 
                backgroundColor: isATS ? 'transparent' : '#f8fafc', 
                padding: isATS ? '0' : '2px 6px', 
                borderRadius: '4px',
                border: isATS ? 'none' : '1px solid #e2e8f0'
              }}>
                {displayVal}{isATS && idx < ints.length - 1 ? ',' : ''}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCustomSectionById = (id) => {
    if (!customSections || customSections.length === 0) return null;
    const sec = customSections.find(c => c.id === id);
    if (!sec) return null;

    // Safety checks
    const titleLower = sec.title?.toLowerCase() || '';
    if (titleLower === 'languages' && languages && languages.length > 0) return null;
    if (titleLower === 'interests' && interests && interests.length > 0) return null;

    return (
      <div key={sec.id} style={{ marginBottom: sectionMarginBottom }}>
        <h3 className="resume-section-title" style={{ color: accent, borderBottom: isATS ? '1px solid #111827' : `1.5px solid ${accent}40`, paddingBottom: '2px' }}>
          {sec.title}
        </h3>
        <p style={{ fontSize: '8.2pt', whiteSpace: 'pre-line', marginTop: '4px', color: '#334155', lineHeight: resolvedLineHeight }}>
          {sec.content}
        </p>
      </div>
    );
  };

  // Maps section IDs to their corresponding renderer functions
  const sectionRenderer = {
    summary: renderSummary,
    experience: renderExperience,
    education: renderEducation,
    skills: renderSkills,
    languages: renderLanguages,
    achievements: renderAchievements,
    interests: renderInterests
  };

  const renderSectionById = (id) => {
    if (sectionRenderer[id]) {
      return sectionRenderer[id]();
    } else if (id.startsWith('cust-')) {
      return renderCustomSectionById(id);
    }
    return null;
  };

  // Loops dynamically over saved or default section order
  const renderOrderedSections = (idsFilter = null) => {
    const defaultOrder = ['summary', 'experience', 'education', 'skills', 'languages', 'achievements', 'interests'];
    const order = customization.sectionOrder || defaultOrder;
    const filteredOrder = idsFilter ? order.filter(id => idsFilter.includes(id) || (idsFilter.includes('customSections') && id.startsWith('cust-'))) : order;
    
    return filteredOrder.map(id => renderSectionById(id));
  };

  // ==========================================
  //          5 DISTINCT LAYOUT ENGINES
  // ==========================================

  // ENGINE 1: Single Column Classic Layout
  const renderSingleColumnLayout = () => (
    <>
      <div style={{
        display: 'flex',
        flexDirection: (customization.headerAlignment === 'center' && !isATS) ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        textAlign: (customization.headerAlignment === 'center' && !isATS) ? 'center' : 'left',
        borderBottom: isATS ? '1px solid #111827' : `2.5px solid ${accent}`,
        paddingBottom: '10px',
        marginBottom: sectionMarginBottom,
        gap: '12px'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '18pt', fontWeight: customization.nameStyle === 'bold' ? '800' : '500', color: accent, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {personalInfo.fullName || 'Priya Sharma'}
          </h1>
          {personalInfo.title && <p style={{ fontSize: '10pt', fontWeight: '600', color: '#475569', margin: '3px 0 0' }}>{personalInfo.title}</p>}
          {renderContactBlock(true)}
        </div>
        {renderProfilePhoto()}
      </div>
      {renderOrderedSections()}
    </>
  );

  // ENGINE 2: Centered Elegant Serif Layout
  const renderCenteredSerifLayout = () => (
    <>
      <div style={{ textAlign: 'center', paddingBottom: '12px', borderBottom: `4px double ${accent}`, marginBottom: sectionMarginBottom }}>
        {renderProfilePhoto()}
        <h1 style={{ fontSize: '20pt', fontWeight: '700', color: accent, margin: '8px 0 2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {personalInfo.fullName || 'Priya Sharma'}
        </h1>
        {personalInfo.title && <p style={{ fontSize: '10pt', fontWeight: '600', color: '#475569', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{personalInfo.title}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
          {renderContactBlock(true)}
        </div>
      </div>
      {renderOrderedSections()}
    </>
  );

  // ENGINE 3: Colored Banner Header Layout
  const renderBannerHeaderLayout = () => (
    <>
      <div style={{
        backgroundColor: accent,
        color: '#ffffff',
        padding: '24px',
        margin: '-16mm -18mm 12px', // Pulls banner edge-to-edge
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '15px'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '20pt', fontWeight: '800', color: '#ffffff', margin: 0, textTransform: 'uppercase' }}>
            {personalInfo.fullName || 'Priya Sharma'}
          </h1>
          {personalInfo.title && <p style={{ fontSize: '10pt', fontWeight: '600', color: 'rgba(255,255,255,0.9)', margin: '3px 0 0' }}>{personalInfo.title}</p>}
          <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.95)' }}>
            {getContactFields().map((f, idx, arr) => (
              <span key={f.id} style={{ fontSize: '7.8pt', marginRight: '6px' }}>
                {f.val}{idx < arr.length - 1 ? '  •  ' : ''}
              </span>
            ))}
          </div>
        </div>
        {renderProfilePhoto()}
      </div>
      <div style={{ marginTop: '12px' }}>
        {renderOrderedSections()}
      </div>
    </>
  );

  // ENGINE 4: Modern Two-Column Split Layout (With 6 Distinct Template Identities)
  const renderTwoColumnLayout = () => {
    const defaultOrder = ['summary', 'experience', 'education', 'skills', 'languages', 'achievements', 'interests'];
    const order = customization.sectionOrder || defaultOrder;

    // Filter sidebar relative order list
    const sidebarIds = order.filter(id => ['skills', 'languages', 'interests'].includes(id));

    // Custom CSS configs mapping for 6 distinct Two-Column/Sidebar Templates:
    // 1. creative_sidebar -> Bold colored accent sidebar, white text.
    // 2. designer_glow -> Soft background gradient glow, accent highlighted text.
    // 3. academic_pro -> Card segment blocks with solid left borders.
    // 4. modern_edge -> Minimal split with dividing tracked inline hairline border.
    // 5. startup_clean -> High contrast deep slate sidebar (elegant pure dark layout).
    // 6. modern_split -> Symmetric minimal column split utilizing spacious frames.

    const isCreativeSidebar = template === 'creative_sidebar';
    const isDesignerGlow = template === 'designer_glow';
    const isAcademicPro = template === 'academic_pro';
    const isModernEdge = template === 'modern_edge';
    const isStartupClean = template === 'startup_clean';
    const isModernSplit = template === 'modern_split';

    // Sidebar Container Style
    let sidebarStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      paddingRight: '18px',
      borderRight: '1px solid #e2e8f0',
      transition: 'all 0.2s ease'
    };

    let mainColumnStyle = {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      paddingLeft: '6px'
    };

    // Apply the 6 distinct styles
    if (isCreativeSidebar) {
      sidebarStyle = {
        ...sidebarStyle,
        backgroundColor: accent,
        color: '#ffffff',
        paddingLeft: '18mm',
        paddingRight: '18px',
        paddingTop: '16mm',
        paddingBottom: '16mm',
        margin: '-16mm 0 -16mm -18mm',
        borderRight: 'none'
      };
      mainColumnStyle = { ...mainColumnStyle, paddingTop: '16mm', paddingRight: '18mm' };
    } else if (isDesignerGlow) {
      sidebarStyle = {
        ...sidebarStyle,
        background: `linear-gradient(180deg, ${accent}15 0%, ${accent}04 100%)`,
        paddingLeft: '18mm',
        paddingRight: '18px',
        paddingTop: '16mm',
        paddingBottom: '16mm',
        margin: '-16mm 0 -16mm -18mm',
        borderRight: `2px solid ${accent}30`
      };
      mainColumnStyle = { ...mainColumnStyle, paddingTop: '16mm', paddingRight: '18mm' };
    } else if (isAcademicPro) {
      sidebarStyle = {
        ...sidebarStyle,
        borderRight: `3px solid ${accent}`,
        backgroundColor: '#f8fafc',
        paddingLeft: '18mm',
        paddingRight: '18px',
        paddingTop: '16mm',
        paddingBottom: '16mm',
        margin: '-16mm 0 -16mm -18mm'
      };
      mainColumnStyle = { ...mainColumnStyle, paddingTop: '16mm', paddingRight: '18mm' };
    } else if (isStartupClean) {
      sidebarStyle = {
        ...sidebarStyle,
        backgroundColor: '#1e293b', // Rich deep slate layout
        color: '#f8fafc',
        paddingLeft: '18mm',
        paddingRight: '18px',
        paddingTop: '16mm',
        paddingBottom: '16mm',
        margin: '-16mm 0 -16mm -18mm',
        borderRight: 'none'
      };
      mainColumnStyle = { ...mainColumnStyle, paddingTop: '16mm', paddingRight: '18mm' };
    } else if (isModernSplit) {
      sidebarStyle = {
        ...sidebarStyle,
        borderRight: 'none',
        borderLeft: `1px solid #cbd5e1`,
        order: 2, // Shift sidebar to the right side for symmetric split variations
        paddingLeft: '18px',
        paddingRight: '18mm',
        paddingTop: '16mm',
        paddingBottom: '16mm',
        margin: '-16mm -18mm -16mm 0'
      };
      mainColumnStyle = { ...mainColumnStyle, order: 1, paddingTop: '16mm', paddingLeft: '18mm', paddingRight: '18px' };
    }

    const headingColor = (isCreativeSidebar || isStartupClean) ? '#ffffff' : accent;
    const itemColor = (isCreativeSidebar || isStartupClean) ? '#f1f5f9' : '#475569';

    return (
      <div style={{ display: 'grid', gridTemplateColumns: isModernSplit ? '0.62fr 0.38fr' : '0.35fr 0.65fr', gap: '24px', height: '100%' }}>
        {/* Sidebar Panel */}
        <div style={sidebarStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
            {renderProfilePhoto()}
            <div>
              <h2 style={{ fontSize: '11pt', fontWeight: '800', color: headingColor, textTransform: 'uppercase', margin: 0 }}>
                {personalInfo.fullName || 'Priya Sharma'}
              </h2>
              {personalInfo.title && <p style={{ fontSize: '8pt', color: isCreativeSidebar ? '#e0e7ff' : '#64748b', fontWeight: '600', margin: '2px 0 0' }}>{personalInfo.title}</p>}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '8.5pt', color: headingColor, textTransform: 'uppercase', fontWeight: '800', borderBottom: `1.5px solid ${isCreativeSidebar ? '#ffffff40' : accent}`, paddingBottom: '3px', marginBottom: '8px' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '8pt', color: itemColor }}>
              {getContactFields().map(f => (
                <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {!isATS && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: customization.iconStyle.includes('circle') ? '50%' : '4px',
                      backgroundColor: customization.iconStyle.includes('filled') ? headingColor : 'transparent',
                      color: customization.iconStyle.includes('filled') ? (isCreativeSidebar ? accent : '#ffffff') : headingColor,
                      border: customization.iconStyle.includes('outline') ? `1.5px solid ${headingColor}` : 'none',
                      fontSize: '0.65rem'
                    }}>
                      {f.icon}
                    </span>
                  )}
                  <span style={{ overflowWrap: 'anywhere' }}>{f.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Draggable sidebar items mapped relative to their drag hierarchy order */}
          {sidebarIds.map(id => {
            if (id === 'skills') {
              const skillTitle = getSectionHeading('skills', 'Skills & Tools');
              return (
                <div key="skills">
                  <h4 style={{ fontSize: '8.5pt', color: headingColor, textTransform: 'uppercase', fontWeight: '800', borderBottom: `1.5px solid ${isCreativeSidebar ? '#ffffff40' : accent}`, paddingBottom: '3px', marginBottom: '8px' }}>{skillTitle}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                    {skills.map((s, idx) => (
                      <span 
                        key={idx} 
                        style={{ 
                          backgroundColor: (isCreativeSidebar || isStartupClean) ? '#ffffff20' : `${accent}09`, 
                          color: (isCreativeSidebar || isStartupClean) ? '#ffffff' : accent,
                          padding: '2px 7px', 
                          borderRadius: '4px', 
                          fontSize: '7.5pt', 
                          fontWeight: '600',
                          border: `1px solid ${(isCreativeSidebar || isStartupClean) ? '#ffffff30' : `${accent}18`}`
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            }
            if (id === 'languages' && languages && languages.length > 0) {
              const langTitle = getSectionHeading('languages', 'Languages');
              return (
                <div key="languages">
                  <h4 style={{ fontSize: '8.5pt', color: headingColor, textTransform: 'uppercase', fontWeight: '800', borderBottom: `1.5px solid ${isCreativeSidebar ? '#ffffff40' : accent}`, paddingBottom: '3px', marginBottom: '8px' }}>{langTitle}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    {languages.map((lang, idx) => (
                      <div key={lang.id || idx} style={{ fontSize: '8pt', color: itemColor }}>
                        <strong style={{ color: headingColor }}>{lang.name}</strong> <span style={{ fontSize: '7.5pt', color: isCreativeSidebar ? '#e0e7ff' : '#64748b' }}>({lang.level})</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (id === 'interests' && interests && interests.length > 0) {
              const intTitle = getSectionHeading('interests', 'Interests');
              return (
                <div key="interests">
                  <h4 style={{ fontSize: '8.5pt', color: headingColor, textTransform: 'uppercase', fontWeight: '800', borderBottom: `1.5px solid ${isCreativeSidebar ? '#ffffff40' : accent}`, paddingBottom: '3px', marginBottom: '8px' }}>{intTitle}</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {interests.map((interest, idx) => {
                      const displayVal = typeof interest === 'object' ? interest.name : interest;
                      return (
                        <span key={idx} style={{ 
                          fontSize: '7.5pt', 
                          color: (isCreativeSidebar || isStartupClean) ? '#ffffff' : '#475569', 
                          backgroundColor: (isCreativeSidebar || isStartupClean) ? '#ffffff15' : '#f8fafc', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          border: `1px solid ${(isCreativeSidebar || isStartupClean) ? '#ffffff20' : '#e2e8f0'}`
                        }}>
                          {displayVal}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Main Core Body (respecting relative ordering) */}
        <div style={mainColumnStyle}>
          {renderOrderedSections(['summary', 'experience', 'education', 'achievements', 'customSections'])}
        </div>
      </div>
    );
  };

  // ENGINE 5: Modern Timeline Minimalist Layout
  const renderTimelineLayout = () => (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `2.5px solid ${accent}`,
        paddingBottom: '10px',
        marginBottom: sectionMarginBottom
      }}>
        <div>
          <h1 style={{ fontSize: '18pt', fontWeight: '800', color: accent, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {personalInfo.fullName || 'Priya Sharma'}
          </h1>
          {personalInfo.title && <p style={{ fontSize: '10pt', fontWeight: '600', color: '#475569', margin: '3px 0 0' }}>{personalInfo.title}</p>}
          {renderContactBlock(true)}
        </div>
        {renderProfilePhoto()}
      </div>
      {renderOrderedSections()}
    </>
  );

  const renderActiveLayoutStructure = () => {
    switch (layoutStyle) {
      case 'two_column':
        return renderTwoColumnLayout();
      case 'banner_header':
        return renderBannerHeaderLayout();
      case 'centered_serif':
        return renderCenteredSerifLayout();
      case 'timeline_column':
        return renderTimelineLayout();
      case 'single_column':
      default:
        return renderSingleColumnLayout();
    }
  };

  // --- SHEET FLOW COMPILERS (With anti-bluring font optimizations) ---
  const renderSinglePage = () => (
    <div className="virtual-sheet" style={{ fontFamily: resolvedFont, padding: marginPadding, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', WebkitFontSmoothing: 'subpixel-antialiased' }}>
      {renderActiveLayoutStructure()}
    </div>
  );

  const renderDualPage = () => {
    const defaultOrder = ['summary', 'experience', 'education', 'skills', 'languages', 'achievements', 'interests'];
    const order = customization.sectionOrder || defaultOrder;

    return (
      <div className="page-break-container" style={{ WebkitFontSmoothing: 'subpixel-antialiased' }}>
        {/* PAGE 1 */}
        <div>
          <div className="page-sheet-label">📄 Page 1 of 2</div>
          <div className="virtual-sheet" style={{ fontFamily: resolvedFont, padding: marginPadding, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}>
            {layoutStyle === 'two_column' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '0.35fr 0.65fr', gap: '24px' }}>
                <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                    {renderProfilePhoto()}
                    <h2 style={{ fontSize: '11pt', fontWeight: '800', color: accent, textTransform: 'uppercase', margin: 0 }}>{personalInfo.fullName || 'Priya Sharma'}</h2>
                  </div>
                  {renderContactBlock(false)}
                  {renderSkills()}
                  {languages && languages.length > 0 && (
                    <div style={{ marginTop: '8px' }}>
                      <h4 style={{ fontSize: '8.5pt', color: accent, textTransform: 'uppercase', fontWeight: '800', borderBottom: `1.5px solid ${accent}`, paddingBottom: '3px', marginBottom: '4px' }}>Languages</h4>
                      {languages.map((lang, idx) => (
                        <div key={lang.id || idx} style={{ fontSize: '7.8pt', color: '#475569' }}>
                          <strong>{lang.name}</strong> ({lang.level})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  {renderOrderedSections(['summary', 'experience'])}
                </div>
              </div>
            ) : (
              <>
                {layoutStyle === 'banner_header' ? (
                  <>
                    <div style={{
                      backgroundColor: accent,
                      color: '#ffffff',
                      padding: '24px',
                      margin: '-16mm -18mm 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '15px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '20pt', fontWeight: '800', color: '#ffffff', margin: 0, textTransform: 'uppercase' }}>
                          {personalInfo.fullName || 'Priya Sharma'}
                        </h1>
                        {personalInfo.title && <p style={{ fontSize: '10pt', fontWeight: '600', color: 'rgba(255,255,255,0.9)', margin: '3px 0 0' }}>{personalInfo.title}</p>}
                        <div style={{ marginTop: '8px', color: 'rgba(255,255,255,0.95)' }}>
                          {getContactFields().map((f, idx, arr) => (
                            <span key={f.id} style={{ fontSize: '7.8pt', marginRight: '6px' }}>
                              {f.val}{idx < arr.length - 1 ? '  •  ' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                      {renderProfilePhoto()}
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      {renderOrderedSections(['summary', 'experience'])}
                    </div>
                  </>
                ) : layoutStyle === 'centered_serif' ? (
                  <>
                    <div style={{ textAlign: 'center', paddingBottom: '12px', borderBottom: `4px double ${accent}`, marginBottom: sectionMarginBottom }}>
                      {renderProfilePhoto()}
                      <h1 style={{ fontSize: '20pt', fontWeight: '700', color: accent, margin: '8px 0 2px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {personalInfo.fullName || 'Priya Sharma'}
                      </h1>
                      {personalInfo.title && <p style={{ fontSize: '10pt', fontWeight: '600', color: '#475569', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{personalInfo.title}</p>}
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
                        {renderContactBlock(true)}
                      </div>
                    </div>
                    {renderOrderedSections(['summary', 'experience'])}
                  </>
                ) : (
                  <>
                    <div style={{
                      display: 'flex',
                      flexDirection: (customization.headerAlignment === 'center' && !isATS) ? 'column' : 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: (customization.headerAlignment === 'center' && !isATS) ? 'center' : 'left',
                      borderBottom: isATS ? '1px solid #111827' : `2.5px solid ${accent}`,
                      paddingBottom: '10px',
                      marginBottom: sectionMarginBottom,
                      gap: '12px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h1 style={{ fontSize: '18pt', fontWeight: customization.nameStyle === 'bold' ? '800' : '500', color: accent, margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {personalInfo.fullName || 'Priya Sharma'}
                        </h1>
                        {personalInfo.title && <p style={{ fontSize: '10pt', fontWeight: '600', color: '#475569', margin: '3px 0 0' }}>{personalInfo.title}</p>}
                        {renderContactBlock(true)}
                      </div>
                      {renderProfilePhoto()}
                    </div>
                    {renderOrderedSections(['summary', 'experience'])}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* PAGE 2 */}
        <div>
          <div className="page-sheet-label">📄 Page 2 of 2</div>
          <div className="virtual-sheet" style={{ fontFamily: resolvedFont, padding: marginPadding, transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px dashed ${accent}`, paddingBottom: '6px', marginBottom: '14px' }}>
              <span style={{ fontSize: '8.2pt', fontWeight: '700', color: accent }}>
                {personalInfo.fullName || 'Priya Sharma'} — Continuation
              </span>
              <span style={{ fontSize: '8pt', color: '#64748b' }}>{personalInfo.email}</span>
            </div>
            {renderOrderedSections(['education', 'achievements', 'interests', 'customSections'])}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div key={template} className="preview-panel" style={{ background: 'transparent', padding: 0 }}>
      {enableSecondPage ? renderDualPage() : renderSinglePage()}
    </div>
  );
}

function Template1({ resumeData }) {
  return (
    <div className="template template-one">
      <h1>{resumeData.name || "Your Name"}</h1>

      <p className="template-contact">
        {resumeData.email || "your.email@example.com"} |{" "}
        {resumeData.phone || "Your Phone Number"}
      </p>

      <section>
        <h3>Professional Summary</h3>
        <p>{resumeData.summary || "Write a short summary about yourself here."}</p>
      </section>

      <section>
        <h3>Skills</h3>
        <p>{resumeData.skills || "Add your skills here."}</p>
      </section>

      <section>
        <h3>Education</h3>
        <p>{resumeData.education || "Add your education details here."}</p>
      </section>

      <section>
        <h3>Experience / Projects</h3>
        <p>{resumeData.experience || "Add your experience or project details here."}</p>
      </section>
    </div>
  );
}