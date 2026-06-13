import React, { useContext, useState, useEffect, useRef } from 'react';
import { ResumeContext } from '../context/ResumeContext';

const templatesDatabase = [
  { id: 'classic_scholar', label: 'Classic Scholar', category: 'ATS Friendly', color: '#1e293b', avatar: '🎓', desc: 'Standard serif layout designed for structured, academic, and industrial positions.', layoutType: 'single_col_serif' },
  { id: 'modern_edge', label: 'Modern Edge (Grid 1)', category: 'Professional', color: '#6366f1', avatar: '⚡', desc: 'Balanced dual column layout with dynamic indigo side highlights.', layoutType: 'two_col_sans' },
  { id: 'creative_sidebar', label: 'Creative Sidebar (Grid 2)', category: 'Creative', color: '#4f46e5', avatar: '📐', desc: 'Symmetric split grid utilizing spacious editorial card columns.', layoutType: 'two_col_sans' },
  { id: 'designer_glow', category: 'Creative', label: 'Designer Glow (Grid 3)', color: '#db2777', avatar: '🌟', desc: 'Warm pink vertical separators and visual project blocks.', layoutType: 'two_col_sans' },
  { id: 'academic_pro', label: 'Academic Pro (Grid 4)', category: 'Freshers', color: '#6d28d9', avatar: '🔬', desc: 'Dual columns detailing educational steps and publications.', layoutType: 'two_col_sans' },
  { id: 'startup_clean', label: 'Startup Clean (Grid 5)', category: 'Creative', color: '#f97316', avatar: '🚀', desc: 'Vibrant orange highlights combined with modern structural borders.', layoutType: 'two_col_sans' },
  { id: 'modern_split', label: 'Modern Split (Grid 6)', category: 'Professional', color: '#1e2e47', avatar: '⚖️', desc: 'Dark column dividers emphasizing professional experience hierarchies.', layoutType: 'two_col_sans' },
  { id: 'corporate_prime', label: 'Corporate Prime', category: 'Professional', color: '#1e3a8a', avatar: '💼', desc: 'Classic deep navy details ideal for enterprise, administration, and tech roles.', layoutType: 'navy_header_sans' },
  { id: 'elegant_serif', label: 'Elegant Serif', category: 'Professional', color: '#7c2d12', avatar: '🌹', desc: 'Georgia serif fonts paired with elegant borders for a commanding executive presence.', layoutType: 'centered_serif' },
  { id: 'minimal_focus', label: 'Minimal Focus', category: 'ATS Friendly', color: '#0f172a', avatar: '✏️', desc: 'Ultra-clean layout emphasizing maximum whitespace and high-density text details.', layoutType: 'minimal_mono' },
  { id: 'tech_fresher', label: 'Tech Fresher', category: 'Freshers', color: '#10b981', avatar: '💻', desc: 'Vibrant emerald green outlines ideal for displaying CS college labs and skills.', layoutType: 'emerald_skills_grid' },
  { id: 'executive_blue', label: 'Executive Blue', category: 'Professional', color: '#2563eb', avatar: '📊', desc: 'Strong horizontal borders matched with professional corporate layouts.', layoutType: 'border_header_sans' },
  { id: 'soft_pro', label: 'Soft Professional', category: 'Professional', color: '#475569', avatar: '🕊️', desc: 'Subtle slate borders and calm backgrounds for balanced presentation.', layoutType: 'soft_border_slate' },
  { id: 'business_elite', label: 'Business Elite', category: 'Professional', color: '#0284c7', avatar: '🏢', desc: 'Clean layouts optimized for business analytics and admin roles.', layoutType: 'sky_business_prime' },
  { id: 'smart_graduate', label: 'Smart Graduate', category: 'Freshers', color: '#8b5cf6', avatar: '💡', desc: 'Violet visual tags ideal for highlighting internships and college labs.', layoutType: 'violet_grad_tags' },
  { id: 'clean_ats', label: 'Clean ATS Only', category: 'ATS Friendly', color: '#111827', avatar: '🤖', desc: 'Strictly linear single-column format (No Photo) for applicant tracking systems.', layoutType: 'pure_ats_linear' },
  { id: 'portfolio_plus', label: 'Portfolio Plus', category: 'Creative', color: '#a855f7', avatar: '🌍', desc: 'Centered header format displaying comprehensive personal URLs.', layoutType: 'purple_url_portfolio' },
  { id: 'bold_metro', label: 'Bold Metro', category: 'Creative', color: '#b91c1c', avatar: '🌆', desc: 'Metropolitan brick-red details for marketing and ad-agency portfolios.', layoutType: 'red_metro_accent' },
  { id: 'skyline_exec', label: 'Skyline Executive', category: 'Professional', color: '#0f172a', avatar: '🏙️', desc: 'Premium slate banner accentuating senior manager records.', layoutType: 'slate_skyline_banner' },
  { id: 'vintage_elegance', label: 'Vintage Elegance', category: 'Professional', color: '#854d0e', avatar: '⏳', desc: 'Warm golden sepia accents offering an established professional feel.', layoutType: 'golden_vintage_serif' },
  { id: 'avant_garde', label: 'Avant Garde', category: 'Creative', color: '#14b8a6', avatar: '🔮', desc: 'Daring structural block patterns for architectural and creative entries.', layoutType: 'teal_avant_garde' }
];

function FadeIn({ children }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      });
    }, { threshold: 0.1 });

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const {
    resumeData,
    setView,
    previewingTemplate,
    setPreviewingTemplate,
    showImportSelection,
    setShowImportSelection,
    selectTemplateLayout,
    loadSampleData,
    clearResume,
    importResumeData,
    showNotification
  } = useContext(ResumeContext);

  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  // Modal State Trigger variables
  const [showPromptModal, setShowPromptModal] = useState(false);
  const fileInputRef = useRef(null);

  const filterCategories = ['All', 'ATS Friendly', 'Creative', 'Professional', 'Freshers'];

  const filteredTemplates = activeFilter === 'All' 
    ? templatesDatabase 
    : templatesDatabase.filter(t => t.category === activeFilter);

  const activeTemplateId = resumeData?.template || 'corporate_prime';
  const recentlyUsedTemplate = templatesDatabase.find(t => t.id === activeTemplateId);

  const handleTemplateSelect = (id) => {
    // When a specific template is chosen from the gallery, save selection and show context importer
    selectTemplateLayout(id);
    setShowImportSelection(true);
  };

  const handleChooseClean = () => {
    const selectedId = previewingTemplate?.id || 'corporate_prime';
    clearResume(selectedId); 
    setShowImportSelection(false);
    setView('builder');
  };

  const handleChooseSample = () => {
    const selectedId = previewingTemplate?.id || 'corporate_prime';
    loadSampleData(selectedId); 
    setShowImportSelection(false);
    setView('builder');
  };

  // Direct CTA Selection Modals Handlers
  const handleOpenCTAModal = () => {
    // General CTA click triggers prompt for default template ('corporate_prime')
    setPreviewingTemplate(null);
    setShowPromptModal(true);
  };

  const handleContinueWithExisting = () => {
    setShowPromptModal(false);
    setView('builder');
  };

  const handleStartFreshDefault = () => {
    setShowPromptModal(false);
    loadSampleData('corporate_prime');
    setView('builder');
  };

  const triggerJSONFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleJSONFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        const success = importResumeData(importedData);
        if (success) {
          setShowPromptModal(false);
          setShowImportSelection(false);
          setView('builder');
        }
      } catch (err) {
        showNotification('Parsing failed. Ensure file is a valid JSON backup.', 'danger');
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = null;
  };

  const scrollToTemplates = () => {
    document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyboardPress = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  const renderTemplateThumbnail = (layoutType, color) => {
    const accentColor = color || "var(--primary)";

    switch (layoutType) {
      case 'two_col_sans':
        return (
          <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%' }}>
            <rect x="0" y="0" width="30" height="140" fill="#f1f5f9" />
            <rect x="30" y="0" width="70" height="140" fill="#ffffff" />
            <circle cx="15" cy="20" r="8" fill={accentColor} />
            <rect x="5" y="35" width="20" height="4" fill="#cbd5e1" rx="1" />
            <rect x="5" y="45" width="20" height="2" fill="#cbd5e1" rx="0.5" />
            <rect x="5" y="50" width="15" height="2" fill="#cbd5e1" rx="0.5" />
            <rect x="38" y="15" width="40" height="8" fill={accentColor} rx="1.5" />
            <rect x="38" y="27" width="25" height="4" fill="#64748b" rx="1" />
            <rect x="38" y="40" width="50" height="3" fill="#cbd5e1" rx="0.5" />
            <rect x="38" y="46" width="45" height="3" fill="#cbd5e1" rx="0.5" />
            <line x1="38" y1="60" x2="90" y2="60" stroke={accentColor} strokeWidth="1" />
            <rect x="38" y="68" width="50" height="4" fill="#94a3b8" rx="1" />
          </svg>
        );
      case 'navy_header_sans':
        return (
          <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }}>
            <rect x="0" y="0" width="100" height="35" fill={accentColor} />
            <circle cx="80" cy="17" r="10" fill="#f1f5f9" opacity="0.9" />
            <rect x="10" y="10" width="50" height="8" fill="#ffffff" rx="1.5" />
            <rect x="10" y="22" width="35" height="4" fill="#cbd5e1" rx="1" />
            <rect x="10" y="48" width="80" height="4" fill="#64748b" rx="1" />
            <rect x="10" y="58" width="80" height="2" fill="#cbd5e1" />
            <rect x="10" y="68" width="80" height="2" fill="#cbd5e1" />
            <rect x="10" y="85" width="45" height="6" fill={accentColor} rx="1" />
            <rect x="10" y="98" width="80" height="3" fill="#cbd5e1" />
            <rect x="10" y="105" width="60" height="3" fill="#cbd5e1" />
          </svg>
        );
      case 'centered_serif':
        return (
          <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }}>
            <circle cx="50" cy="22" r="10" fill="#f1f5f9" stroke={accentColor} strokeWidth="1" />
            <rect x="25" y="38" width="50" height="6" fill={accentColor} rx="1" />
            <rect x="35" y="48" width="30" height="3" fill="#cbd5e1" rx="0.5" />
            <line x1="10" y1="58" x2="90" y2="58" stroke="#cbd5e1" strokeWidth="0.75" />
            <rect x="10" y="66" width="30" height="5" fill="#64748b" rx="1" />
            <rect x="10" y="77" width="80" height="3" fill="#cbd5e1" />
            <rect x="10" y="83" width="75" height="3" fill="#cbd5e1" />
            <line x1="10" y1="94" x2="90" y2="94" stroke="#cbd5e1" strokeWidth="0.75" />
            <rect x="10" y="102" width="40" height="5" fill="#64748b" rx="1" />
            <rect x="10" y="112" width="80" height="3" fill="#cbd5e1" />
          </svg>
        );
      case 'teal_banner_creative':
        return (
          <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }}>
            <rect x="0" y="0" width="100" height="15" fill={accentColor} />
            <rect x="10" y="25" width="45" height="10" fill="#1e2e47" rx="1" />
            <rect x="10" y="38" width="30" height="4" fill="#cbd5e1" rx="1" />
            <circle cx="80" cy="38" r="12" fill="#f1f5f9" stroke={accentColor} strokeWidth="1.5" />
            <line x1="10" y1="58" x2="90" y2="58" stroke={accentColor} strokeWidth="1.5" />
            <rect x="10" y="68" width="80" height="4" fill="#cbd5e1" />
            <rect x="10" y="76" width="70" height="4" fill="#cbd5e1" />
            <rect x="10" y="90" width="40" height="6" fill="#1e2e47" rx="1" />
            <rect x="10" y="102" width="80" height="3" fill="#cbd5e1" />
          </svg>
        );
      case 'minimal_mono':
        return (
          <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }}>
            <rect x="10" y="15" width="80" height="8" fill="#1e293b" rx="1" />
            <rect x="10" y="27" width="40" height="4" fill="#64748b" rx="0.5" />
            <line x1="10" y1="38" x2="90" y2="38" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2,2" />
            <rect x="10" y="46" width="80" height="4" fill="#94a3b8" />
            <rect x="10" y="54" width="75" height="4" fill="#cbd5e1" />
            <rect x="10" y="68" width="50" height="6" fill="#1e293b" />
            <rect x="10" y="80" width="80" height="3" fill="#cbd5e1" />
            <rect x="10" y="87" width="80" height="3" fill="#cbd5e1" />
          </svg>
        );
      case 'single_col_serif':
      default:
        return (
          <svg viewBox="0 0 100 140" style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }}>
            <rect x="10" y="12" width="50" height="8" fill={accentColor} rx="1" />
            <rect x="10" y="24" width="30" height="4" fill="#cbd5e1" rx="0.5" />
            <rect x="10" y="32" width="80" height="3" fill="#e2e8f0" rx="0.5" />
            <circle cx="82" cy="20" r="10" fill="#f1f5f9" />
            <line x1="10" y1="44" x2="90" y2="44" stroke={accentColor} strokeWidth="1" />
            <rect x="10" y="52" width="35" height="6" fill="#64748b" rx="1" />
            <rect x="10" y="64" width="80" height="4" fill="#cbd5e1" />
            <rect x="10" y="72" width="75" height="4" fill="#cbd5e1" />
            <rect x="10" y="86" width="35" height="6" fill="#64748b" rx="1" />
            <rect x="10" y="98" width="80" height="4" fill="#cbd5e1" />
            <rect x="10" y="106" width="50" height="4" fill="#cbd5e1" />
          </svg>
        );
    }
  };

  const renderModalLivePreview = (tempId, themeColor) => {
    const name = "P.Sai Manikanta";
    const title = "Senior Full Stack Developer";
    const summary = "Passionate Full Stack Developer with hands-on experience building responsive web applications using React, Node.js, Express, and MongoDB. Skilled in developing scalable REST APIs, modern user interfaces, and database-driven solutions. Strong problem-solving abilities with a focus on clean code, performance optimization, and delivering real-world software products.";
    const skillList = ["React", "Node.js", "MongoDB", "Express.js", "Product Strategy", "Figma Wireframing", "Roadmapping", "SQL Analytics", "Git/GitHub"];

    const activeFont = ['classic_scholar', 'elegant_serif', 'vintage_elegance'].includes(tempId) 
      ? 'Georgia, serif' 
      : "'Inter', sans-serif";

    return (
      <div style={{
        width: '100%',
        maxWidth: '380px',
        aspectRatio: '1/1.41',
        backgroundColor: '#ffffff',
        boxShadow: '0 12px 35px rgba(15, 23, 42, 0.1)',
        borderRadius: '12px',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxSizing: 'border-box',
        fontFamily: activeFont,
        textAlign: 'left',
        overflow: 'hidden'
      }}>
        <div style={{
          borderBottom: `2px solid ${themeColor}`,
          paddingBottom: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '11pt', fontWeight: '800', color: themeColor, textTransform: 'uppercase', letterSpacing: '-0.3px' }}>{name}</h4>
            <p style={{ margin: '1px 0 0', fontSize: '7.5pt', color: '#475569', fontWeight: '600' }}>{title}</p>
            <div style={{ fontSize: '6pt', color: '#64748b', marginTop: '3px' }}>
              manikanta.p@gmail.com | +91 91234 56789 | Hyderabad, India
            </div>
          </div>
          {tempId !== 'clean_ats' && (
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: tempId === 'elegant_serif' ? '0' : '50%',
              backgroundColor: '#f1f5f9',
              border: `1.5px solid ${themeColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTuaYfHS7Wbt8RwdfVezRXJeTtOjz_z338A6I7R-NApQ&s" 
                alt="Profile Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        <div>
          <h5 style={{ margin: '0 0 2px', fontSize: '7pt', color: themeColor, textTransform: 'uppercase', fontWeight: '800' }}>Profile Summary</h5>
          <p style={{ margin: 0, fontSize: '6pt', color: '#334155', lineHeight: '1.35', textAlign: 'justify' }}>{summary}</p>
        </div>

        <div>
          <h5 style={{ margin: '0 0 3px', fontSize: '7pt', color: themeColor, textTransform: 'uppercase', fontWeight: '800' }}>Experience</h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '6.5pt', fontWeight: '700' }}>
                <span style={{ color: '#1e293b' }}>Senior Full Stack Developer</span>
                <span style={{ color: '#64748b' }}>2021 - Present</span>
              </div>
              <div style={{ fontSize: '6pt', color: themeColor, fontWeight: '600' }}>ServiceNow · Hyderabad, India</div>
              <p style={{ margin: '1px 0 0', fontSize: '5.8pt', color: '#475569', lineHeight: '1.3' }}>
                • Built and deployed responsive MERN stack web applications serving real-world use cases.
              </p>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '6.5pt', fontWeight: '700' }}>
                <span style={{ color: '#1e293b' }}>Project Developer</span>
                <span style={{ color: '#64748b' }}>2019 - 2020</span>
              </div>
              <div style={{ fontSize: '6pt', color: themeColor, fontWeight: '600' }}>Darwinbox · Hyderabad, India</div>
              <p style={{ margin: '1px 0 0', fontSize: '5.8pt', color: '#475569', lineHeight: '1.3' }}>
                • Designed and developed reusable React UI components for scalable applications.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h5 style={{ margin: '0 0 2px', fontSize: '7pt', color: themeColor, textTransform: 'uppercase', fontWeight: '800' }}>Education</h5>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '6.5pt', fontWeight: '700' }}>
            <span style={{ color: '#1e293b' }}>B.Tech in Computer Science & Engineering</span>
            <span style={{ color: '#64748b' }}>2021 - 2025</span>
          </div>
          <div style={{ fontSize: '6pt', color: '#475569' }}>BITS Pilani, Hyderabad Campus · CGPA: 9.1</div>
        </div>

        <div>
          <h5 style={{ margin: '0 0 3px', fontSize: '7pt', color: themeColor, textTransform: 'uppercase', fontWeight: '800' }}>Technical Skills</h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
            {skillList.map((skill, idx) => (
              <span key={idx} style={{ fontSize: '5.5pt', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', color: '#1e293b', padding: '1px 4px', borderRadius: '3px', fontWeight: '600' }}>{skill}</span>
            ))}
          </div>
        </div>

        <div>
          <h5 style={{ margin: '0 0 2px', fontSize: '7pt', color: themeColor, textTransform: 'uppercase', fontWeight: '800' }}>Languages</h5>
          <div style={{ fontSize: '6.2pt', color: '#334155' }}>
            <strong>English</strong> (Fluent) · <strong>Telugu</strong> (Native) · <strong>Hindi</strong> (Professional)
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: 'var(--slate-50)', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: 'var(--text-primary)', overflowX: 'hidden' }}>
      
      {/* Hidden manual JSON file uploader */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        accept=".json" 
        onChange={handleJSONFileImport} 
      />

      {/* Dynamic Keyframes & CSS Rules Embedded Safely */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .marquee-container:hover {
          animation-play-state: paused;
        }
        .subtle-grid {
          background-image: radial-gradient(
            rgba(139,92,246,0.18) 0.75px,
            transparent 0.75px
          );
          background-size: 24px 24px;
        }
        .premium-btn {
          background: linear-gradient(
            135deg,
            #06b6d4 0%,
            #6417fdf6 50%,
            #ec9a48 100%
          );
          color: #ffffff;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.15);
        }
        .premium-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.25);
          filter: brightness(1.03);
        }
      `}</style>

      {/* 1. SEAMLESS NAVIGATION BAR */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.25rem 4rem',
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        WebkitBackdropFilter: 'blur(18px)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(124,58,237,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 99
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="10" fill="#fef3c7"/>
    <rect x="7" y="8" width="11" height="1.8" rx="0.9" fill="#92400e"/>
    <rect x="7" y="12" width="18" height="1.8" rx="0.9" fill="#92400e"/>
    <rect x="7" y="16" width="13" height="1.8" rx="0.9" fill="#92400e"/>
    <rect x="7" y="20" width="16" height="1.8" rx="0.9" fill="#92400e"/>
    <path d="M22 6 L24 10 L20 9 Z" fill="#f59e0b"/>
    <path d="M24 10 L22 14 L20 9 Z" fill="#fbbf24"/>
  </svg>
  <div style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.6px' }}>
    <span style={{ color: '#1c1917' }}>Resume</span>
    <span style={{ background: 'linear-gradient(90deg,#f59e0b,#ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Spark</span>
  </div>
</div>
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <button 
            onClick={scrollToTemplates}
            style={{ 
              background: 'none',
              border: 'none',
              color: hoveredLink === 'templates' ? 'var(--primary)' : 'var(--text-secondary)', 
              fontWeight: '700', 
              fontSize: '0.88rem', 
              cursor: 'pointer',
              transition: 'color 0.2s ease' 
            }} 
            onMouseEnter={() => setHoveredLink('templates')} 
            onMouseLeave={() => setHoveredLink(null)}
          >
            Resume Templates
          </button>
          <a 
            href="#about-section" 
            style={{ 
              textDecoration: 'none', 
              color: hoveredLink === 'about' ? 'var(--primary)' : 'var(--text-secondary)', 
              fontWeight: '700', 
              fontSize: '0.88rem', 
              transition: 'color 0.2s ease' 
            }} 
            onMouseEnter={() => setHoveredLink('about')} 
            onMouseLeave={() => setHoveredLink(null)}
          >
            About
          </a>
          
         

          <button 
            onClick={handleOpenCTAModal} 
            className="premium-btn"
            style={{ padding: '0.6rem 1.4rem', fontSize: '0.85rem' }}
          >
            Start Building
          </button>
        </div>
      </nav>

      {/* 2. HERO GRID SECTION */}
      <section className="subtle-grid" style={{ padding: '5rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.10fr 0.90fr', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Column */}
          <div style={{ textStyle: 'left', textAlign: 'left' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--primary-light)', border: '1px solid var(--slate-300)', padding: '0.35rem 0.85rem', borderRadius: '99px', marginBottom: '1.5rem' }}>
              <span style={{ color: 'var(--primary)', stroke: 'var(--slate-700)', fontWeight: '700', fontSize: '0.78rem' }}>📄 ATS Friendly</span>
              <span style={{ color: 'var(--slate-300)' }}>|</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: '600' }}>⚡ Fast PDF Export</span>
            </div>
            
            <h1 style={{ fontSize: '3.6rem', fontWeight: '900', color: 'var(--slate-900)', lineHeight: '1.1', letterSpacing: '-1.5px', marginBottom: '1.5rem', fontFamily: 'Georgia, serif' }}>
              Build a job-winning resume <br />
              <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>free of limits.</span>
            </h1>
            
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '520px' }}>
              Your first resume is 100% free forever. No watermark, no signup lock, and no payment prompts. Fast local editing with professional design controls.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={handleOpenCTAModal} 
                className="premium-btn"
                style={{ padding: '1rem 2.25rem', fontSize: '1rem', borderRadius: '10px' }}
              >
                Start Customizing Now ✨
              </button>
              
             
            </div>
          </div>

          {/* Right Column */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(124,58,237,0.08)',
              borderRadius: '18px',
              boxShadow: '0 30px 60px -15px rgba(44, 37, 32, 0.08)',
              overflow: 'hidden',
              padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--slate-100)' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#34d399' }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>resumespark.com/editor</span>
              </div>
              
              {/* Detailed Real-World Template Skeleton Mockup */}
              {/* Replaced Slate/Card mockup directly with specified image in exact dimensions */}
<div style={{ width: '100%', height: '340px', borderRadius: '8px', overflow: 'hidden' }}>
  <img 
    src="https://i.pinimg.com/736x/43/d5/5a/43d55ac3f0d1a663bf91a02f7b502425.jpg" 
    alt="Live Design Customizer Preview Layout" 
    style={{ 
      width: '100%', 
      height: '100%', 
      objectFit: 'cover', 
      objectPosition: 'center top' 
    }}
  />
</div>
            </div>
            
            <div style={{
              position: 'absolute',
              bottom: '-15px',
              left: '-20px',
              background: 'var(--accent-gradient)',
              color: 'var(--slate-900)',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '0.78rem',
              boxShadow: '0 10px 15px -3px rgba(184, 147, 92, 0.2)',
              zIndex: 10
            }}>
              ✨ Live Design Customizer
            </div>
          </div>
        </div>
      </section>

      {/* 3. RECENTLY USED SECTION */}
      {recentlyUsedTemplate && (
        <FadeIn>
          <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 4rem' }}>
            <div style={{
              background: 'var(--white)',
              border: '1px solid var(--slate-300)',
              borderRadius: '16px',
              padding: '1.5rem 2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 'var(--shadow-premium)',
              textAlign: 'left'
            }}>
              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' }}>Recently Used Layout</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--slate-900)', marginTop: '0.5rem', fontFamily: 'Georgia, serif' }}>
                  Continue Crafting "{resumeData.resumeName || 'Resume 1'}"
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Active design: <strong>{recentlyUsedTemplate.label}</strong>. Jump back inside to finalize edits.
                </p>
              </div>
              <button 
                onClick={() => setView('builder')}
                className="premium-btn"
                style={{ padding: '0.85rem 1.75rem', fontSize: '0.88rem', borderRadius: '8px' }}
              >
                Go to Workspace →
              </button>
            </div>
          </div>
        </FadeIn>
      )}

      {/* 4. VALUE PROPOSITION STATS */}
      <section id="about-section" style={{ padding: '5rem 4rem', backgroundColor: 'var(--slate-100)', borderTop: '1px solid var(--slate-200)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: '800', marginBottom: '3.5rem', letterSpacing: '-0.5px', fontFamily: 'Georgia, serif' }}>
            Uncompromising features on our free tier
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div style={{ background: 'var(--white)', border: '1px solid var(--slate-200)', padding: '2rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--primary)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Privacy & GDPR compliant</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Your data is stored strictly in your local browser cache. We do not transmit or monetize your personal history.
              </p>
            </div>
            <div style={{ background: 'var(--white)', border: '1px solid var(--slate-200)', padding: '2rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--primary)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Unlimited watermark-free PDFs</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#4a453f', lineHeight: '1.5' }}>
                Download and edit your documents as many times as you like. We never brand your page or impose hidden fees.
              </p>
            </div>
            <div style={{ background: 'var(--white)', border: '1px solid var(--slate-200)', padding: '2rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--primary)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 2 7 12 12 22 7 12 22"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>20+ fully customizable templates</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Explore layouts tailored for and tested against popular ATS software. Modify fonts, layout details, and spacing dynamically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE TEMPLATES GALLERY WITH CATEGORY FILTERS */}
      <section id="templates-section" style={{ padding: '5rem 4rem' }}>
        <FadeIn>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '2.4rem', fontWeight: '900', letterSpacing: '-1px', fontFamily: 'Georgia, serif' }}>Choose from Premium Resume Templates</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>Select a layout to launch the split-screen visual previewer.</p>
            </div>

            {/* TAB FILTER CONTROLS */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '3rem',
              flexWrap: 'wrap'
            }}>
              {filterCategories.map((cat) => {
                const isActive = activeFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={0}
                    style={{
                      padding: '0.55rem 1.25rem',
                      borderRadius: '99px',
                      border: isActive ? 'none' : '1px solid var(--slate-300)',
                      backgroundColor: isActive ? 'var(--primary)' : 'var(--white)',
                      color: isActive ? 'var(--white)' : 'var(--text-secondary)',
                      fontWeight: '700',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      outline: 'none',
                      boxShadow: isActive ? '0 4px 10px rgba(30, 46, 71, 0.15)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
              {filteredTemplates.map((temp) => {
                const isCardHovered = hoveredCard === temp.id;
                return (
                  <div 
                    key={temp.id}
                    onClick={() => setPreviewingTemplate(temp)}
                    onKeyDown={(e) => handleKeyboardPress(e, () => setPreviewingTemplate(temp))}
                    role="button"
                    tabIndex={0}
                    aria-label={`Preview template layout: ${temp.label}`}
                    style={{
                      background: 'var(--white)',
                      border: '1px solid',
                      borderColor: isCardHovered ? 'var(--primary)' : 'var(--slate-200)',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transform: isCardHovered ? 'translateY(-6px)' : 'translateY(0)',
                      boxShadow: isCardHovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {/* SVG Thumbnail Blueprint */}
                    <div style={{ height: '160px', background: 'var(--slate-50)', display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--slate-100)', padding: '1rem' }}>
                      <div style={{ width: '100%', height: '100%', maxWidth: '110px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', borderRadius: '2px', overflow: 'hidden' }}>
                        {renderTemplateThumbnail(temp.layoutType, temp.color)}
                      </div>
                    </div>
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', alignSelf: 'flex-start', textTransform: 'uppercase' }}>
                        {temp.category}
                      </span>
                      <h4 style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--slate-900)', fontFamily: 'Georgia, serif' }}>{temp.label}</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{temp.desc}</p>
                    </div>
                    <button style={{ width: '100%', border: 'none', borderTop: '1px solid var(--slate-100)', padding: '0.75rem 0', fontWeight: '700', fontSize: '0.8rem', color: 'var(--primary)', background: 'transparent', cursor: 'pointer' }}>
                      Preview Layout →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 6. HIGH-FIDELITY BEFORE / AFTER COMPARISON SECTION */}
      <section style={{ padding: '6rem 4rem', backgroundColor: 'var(--slate-100)', borderTop: '1px solid var(--slate-200)', borderBottom: '1px solid var(--slate-200)' }}>
        <FadeIn>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-1px', color: 'var(--slate-900)', fontFamily: 'Georgia, serif' }}>
                See the difference ResumeSpark makes
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.05rem' }}>
                Same candidate. Same experience. Completely different impression.
              </p>
            </div>

            <div style={{ gridTemplateColumns: 'minmax(0,1fr) 56px minmax(0,1fr)', display: 'grid', alignItems: 'stretch', maxWidth: '940px', margin: '0 auto' }}>

              {/* BEFORE */}
              <div style={{ background: '#ffffff', border: '1px solid var(--slate-200)', borderRadius: '12px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', aspectRatio: '1 / 1.414' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '3px 10px', borderRadius: '99px', margin: '12px 12px 0', alignSelf: 'flex-start', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
                  Before — Plain Word Doc
                </span>
                <div style={{ padding: '14px 16px 16px', fontFamily: "'Inter', sans-serif", flex: 1, textAlign: 'left', overflow: 'hidden' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '2px' }}>P.Sai Manikanta</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px' }}>Senior Full Stack Developer</div>
                  <div style={{ fontSize: '9px', color: '#94a3b8', marginBottom: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    manikanta.p@gmail.com | +91 91234 56789 | Hyderabad, India
                  </div>

                  <div>
                    <div style={{ fontSize: '9px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', marginBottom: '4px', marginTop: '8px' }}>Summary</div>
                    <div style={{ fontSize: '8.5px', color: '#4a453f', lineHeight: '1.5' }}>I am a full stack developer with experience. I built applications with React, Node.js, Express, and MongoDB. I am good at solving problems and writing code.Passionate Full Stack Developer with hands-on experience building responsive web applications using React, Node.js, Express, and MongoDB.</div>
                  </div>

                  <div style={{ fontSize: '9px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', marginTop: '10px', marginBottom: '4px' }}>Work Experience</div>
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '9px', fontWeight: '600', color: '#1e293b' }}>Senior Full Stack Developer</div>
                    <div style={{ fontSize: '8.5px', color: '#64748b', marginBottom: '3px' }}>ServiceNow · 2021 – Present</div>
                    <div style={{ fontSize: '8px', color: '#4a453f', lineHeight: '1.5' }}>- Developed MERN applications and wrote secure backend APIs.</div>
                  </div>

                  <div style={{ fontSize: '9px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', marginTop: '10px', marginBottom: '4px' }}>Education</div>
                  <div style={{ fontSize: '9px', fontWeight: '600', color: '#1e293b' }}>B.Tech Computer Science</div>
                  <div style={{ fontSize: '8.5px', color: '#64748b' }}>BITS Pilani,Hyderabad Campus · 2021–2025</div>
                  <div style={{ fontSize: '9px', fontWeight: '600', color: '#1e293b' }}>Intermediate (MPC)</div>
                  <div style={{ fontSize: '8.5px', color: '#64748b' }}>Narayana Junior College· 2019–2021</div>
                </div>
              </div>

              {/* SWAP FLOW */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '1px', flex: 1, background: 'var(--slate-300)' }} />
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', fontWeight: '700', fontSize: '1rem', flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>→</div>
                <div style={{ width: '1px', flex: 1, background: 'var(--slate-300)' }} />
              </div>

              {/* AFTER */}
              <div style={{ background: '#ffffff', border: '2px solid #b8935c', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(184,147,92,0.15)', display: 'flex', flexDirection: 'column', aspectRatio: '1 / 1.414' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: '700', backgroundColor: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: '99px', margin: '12px 12px 0', alignSelf: 'flex-start', textTransform: 'uppercase', fontFamily: "'Inter', sans-serif" }}>
                  After — ResumeSpark
                </span>

                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                  <div style={{ width: '38%', backgroundColor: 'var(--primary)', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#2c3e5d', border: '2px solid #d4b582', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                      <svg width="56" height="56" viewBox="0 0 56 56">
                        <circle cx="28" cy="21" r="11" fill="#d4b582" opacity="0.9"/>
                        <ellipse cx="28" cy="48" rx="18" ry="13" fill="#d4b582" opacity="0.9"/>
                      </svg>
                    </div>

                    <div>
                      <div style={{ fontSize: '7.5px', fontWeight: '700', color: '#d4b582', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1px solid rgba(212,181,130,0.3)', paddingBottom: '3px', marginBottom: '5px', fontFamily: "'Inter',sans-serif" }}>Contact</div>
                      {['manikanta.p@gmail.com', '+91 91234 56789', 'Hyderabad, India', 'linkedin.com/in/p-manikanta'].map(i => (
                        <div key={i} style={{ fontSize: '6.5px', color: '#e0e7ff', lineHeight: '1.4', fontFamily: "'Inter',sans-serif", overflowWrap: 'anywhere' }}>{i}</div>
                      ))}
                    </div>

                    <div>
                      <div style={{ fontSize: '7.5px', fontWeight: '700', color: '#d4b582', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1px solid rgba(212,181,130,0.3)', paddingBottom: '3px', marginBottom: '5px', fontFamily: "'Inter',sans-serif" }}>Skills</div>
                      {['React', 'Node.js', 'Frontend', 'JavaScript', 'MongoDB', 'Express.js', 'Git/GitHub'].map(s => (
                        <span key={s} style={{ display: 'inline-block', background: 'rgba(212,181,130,0.15)', border: '1px solid rgba(212,181,130,0.25)', color: '#f4efe9', fontSize: '6.5px', padding: '1px 4px', borderRadius: '3px', marginRight: '2px', marginBottom: '2px', fontFamily: "'Inter',sans-serif" }}>{s}</span>
                      ))}
                    </div>
                    <div>
  <div
    style={{
      fontSize: '7.5px',
      fontWeight: '700',
      color: '#d4b582',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      borderBottom: '1px solid rgba(212,181,130,0.3)',
      paddingBottom: '3px',
      marginBottom: '5px',
      fontFamily: "'Inter',sans-serif"
    }}
  >
    Languages
  </div>

  {[
    'English • Fluent',
    'Telugu • Native',
    'Hindi • Professional'
  ].map(lang => (
    <div
      key={lang}
      style={{
        fontSize: '6.5px',
        color: '#e0e7ff',
        lineHeight: '1.5',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      {lang}
    </div>
  ))}
</div>
                  </div>

                  <div style={{ flex: 1, padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)', fontFamily: 'Georgia, serif', lineHeight: '1.1' }}>P.Sai Manikanta</div>
                      <div style={{ fontSize: '8px', fontWeight: '700', color: '#b8935c', letterSpacing: '0.6px', textTransform: 'uppercase', marginTop: '2px', fontFamily: "'Inter',sans-serif" }}>Senior Full Stack Developer</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '7.5px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.8px', borderBottom: '1.5px solid #b8935c', paddingBottom: '2px', marginBottom: '4px', fontFamily: "'Inter',sans-serif" }}>Profile</div>
                      <div style={{ fontSize: '7.5px', color: '#4a453f', lineHeight: '1.4', fontFamily: "'Inter',sans-serif", textAlign: 'justify' }}>Passionate Full Stack Developer with hands-on experience building responsive web applications using React, Node.js, Express, and MongoDB.</div>
                      
                      {/* EXPERIENCE */}
<div>
                      {/* EDUCATION */}
<div>
  <div
    style={{
      fontSize: '8px',
      fontWeight: '700',
      color: 'var(--primary)',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      borderBottom: '1.5px solid #b8935c',
      paddingBottom: '3px',
      marginBottom: '5px',
      marginTop: '6px',
      fontFamily: "'Inter',sans-serif"
    }}
  >
    Education
  </div>

  <div style={{ marginBottom: '6px' }}>
    <div
      style={{
        fontSize: '8px',
        fontWeight: '700',
        color: '#1f2937',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      B.Tech in Computer Science & Engineering
    </div>

    <div
      style={{
        fontSize: '7px',
        color: '#b8935c',
        fontWeight: '600',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Engineering College • 2021 – 2025
    </div>

    <div
      style={{
        fontSize: '7px',
        color: '#4a453f',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      CGPA: 8.8 / 10
    </div>
  </div>

  <div>
    <div
      style={{
        fontSize: '8px',
        fontWeight: '700',
        color: '#1f2937',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Intermediate (MPC)
    </div>

    <div
      style={{
        fontSize: '7px',
        color: '#b8935c',
        fontWeight: '600',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Narayana Junior College • 2019 – 2021
    </div>

    <div
      style={{
        fontSize: '7px',
        color: '#4a453f',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Percentage: 95%
      
    </div>
  </div>
</div>
  <div
    style={{
      fontSize: '8px',
      fontWeight: '700',
      color: 'var(--primary)',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      borderBottom: '1.5px solid #b8935c',
      paddingBottom: '3px',
      marginBottom: '5px',
      fontFamily: "'Inter',sans-serif"
    }}
  >
    Experience
  </div>

  <div style={{ marginBottom: '6px' }}>
    <div
      style={{
        fontSize: '8px',
        fontWeight: '700',
        color: '#1f2937',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Full Stack Developer
    </div>

    <div
      style={{
        fontSize: '7px',
        color: '#b8935c',
        fontWeight: '600',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Personal Projects • 2024 – Present
    </div>

    <div
      style={{
        fontSize: '7px',
        color: '#4a453f',
        lineHeight: '1.5',
        marginTop: '2px',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Built MERN stack applications including ResumeSpark and portfolio websites with responsive UI and REST API integration.
    </div>
  </div>

  <div>
    <div
      style={{
        fontSize: '8px',
        fontWeight: '700',
        color: '#1f2937',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Web Development Intern
    </div>

    <div
      style={{
        fontSize: '7px',
        color: '#b8935c',
        fontWeight: '600',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Oasis Infobyte • Feb 2025 – Mar 2025
    </div>

    <div
      style={{
        fontSize: '7px',
        color: '#4a453f',
        lineHeight: '1.5',
        marginTop: '2px',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Developed responsive web interfaces and improved user experience through modern frontend development practices.
    </div>
  </div>
</div>
{/* PROJECTS */}
<div>
  <div
    style={{
      fontSize: '8px',
      fontWeight: '700',
      color: 'var(--primary)',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      borderBottom: '1.5px solid #b8935c',
      paddingBottom: '3px',
      marginBottom: '5px',
      marginTop: '6px',
      fontFamily: "'Inter',sans-serif"
    }}
  >
    Projects
  </div>

  <div style={{ marginBottom: '6px' }}>
    <div
      style={{
        fontSize: '8px',
        fontWeight: '700',
        color: '#1f2937',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      ResumeSpark
    </div>

    <div
      style={{
        fontSize: '7px',
        color: '#b8935c',
        fontWeight: '600',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      React • Node.js • MongoDB
    </div>

    <div
      style={{
        fontSize: '7px',
        color: '#4a453f',
        lineHeight: '1.5',
        marginTop: '2px',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Developed a premium resume builder with customizable templates, live preview, and PDF export functionality.
    </div>
  </div>

  <div>
    <div
      style={{
        fontSize: '8px',
        fontWeight: '700',
        color: '#1f2937',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Personal Portfolio
    </div>

    <div
      style={{
        fontSize: '7px',
        color: '#b8935c',
        fontWeight: '600',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      React • JavaScript • CSS
    </div>

    <div
      style={{
        fontSize: '7px',
        color: '#4a453f',
        lineHeight: '1.5',
        marginTop: '2px',
        fontFamily: "'Inter',sans-serif"
      }}
    >
      Built a responsive developer portfolio showcasing projects, skills, certifications, and professional achievements.
    </div>
  </div>
</div>
{/* ACHIEVEMENTS */}
<div>
  <div
    style={{
      fontSize: '8px',
      fontWeight: '700',
      color: 'var(--primary)',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      borderBottom: '1.5px solid #b8935c',
      paddingBottom: '3px',
      marginBottom: '5px',
      marginTop: '6px',
      fontFamily: "'Inter',sans-serif"
    }}
  >
    Achievements
  </div>

  <div
    style={{
      fontSize: '7px',
      color: '#4a453f',
      lineHeight: '1.6',
      fontFamily: "'Inter',sans-serif"
    }}
  >
    • Built and deployed multiple MERN stack projects
  </div>

  <div
    style={{
      fontSize: '7px',
      color: '#4a453f',
      lineHeight: '1.6',
      fontFamily: "'Inter',sans-serif"
    }}
  >
    • Completed Full Stack Development Internship
  </div>
</div>

                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
              <button
                onClick={handleOpenCTAModal}
                className="premium-btn"
                style={{ padding: '0.9rem 2.25rem', fontSize: '0.95rem', borderRadius: '10px' }}
              >
                Get the After Version ✨
              </button>
            </div>

          </div>
        </FadeIn>
      </section>

      {/* 7. ROTATING TEMPLATES MARQUEE */}
      <div style={{
        overflow: 'hidden',
        padding: '3rem 0',
        backgroundColor: 'var(--white)',
        borderTop: '1px solid var(--slate-200)',
        borderBottom: '1px solid var(--slate-200)'
      }}>
        <div className="marquee-container">
          {[...templatesDatabase, ...templatesDatabase].map((temp, index) => {
            let categoryTagline = "Modern layout";
            if (temp.category === "ATS Friendly") categoryTagline = "Optimized for HR parsers";
            if (temp.category === "Professional") categoryTagline = "Corporate-ready style";
            if (temp.category === "Creative") categoryTagline = "Distinctive visual design";
            if (temp.category === "Freshers") categoryTagline = "Showcase academic projects";

            return (
              <div 
                key={index}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  background: 'var(--slate-50)',
                  border: '1px solid var(--slate-200)',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  marginRight: '1.5rem',
                  minWidth: '280px'
                }}
              >
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: temp.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                  {temp.avatar}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--slate-900)' }}>{temp.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span style={{ fontWeight: '600', color: temp.color }}>{temp.category}</span> • {categoryTagline}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 8. CTA BANNER */}
      <section style={{ padding: '5rem 4rem', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '1.25rem', fontFamily: 'Georgia, serif' }}>Ready to launch your application?</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2.25rem' }}>Create a beautifully typeset, printable, and ATS-friendly resume file in minutes.</p>
        <button 
          onClick={handleOpenCTAModal} 
          className="premium-btn"
          style={{ padding: '1rem 2.5rem', fontSize: '1.05rem', borderRadius: '10px' }}
        >
          Build Your Resume Now ✨
        </button>
      </section>

{/* PREMIUM FOOTER */}
<footer style={{
  position: 'relative',
  padding: '6rem 2rem 3rem',
  background: 'linear-gradient(160deg, #1a0a2e 0%, #0d1f3c 40%, #0a1628 70%, #130820 100%)',
  overflow: 'hidden',
  borderTop: '1px solid rgba(139,92,246,0.2)',
}}>

  {/* Ambient glow blobs */}
  <div style={{ position: 'absolute', top: '-80px', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
  <div style={{ position: 'absolute', bottom: '0', right: '10%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

  <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem', borderRadius: '28px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(18px)', border: '1px solid rgba(139,92,246,0.15)', textAlign: 'center', position: 'relative', zIndex: 2, boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}>

    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
      <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
        <rect width="54" height="54" rx="14" fill="rgba(254,243,199,0.12)" stroke="rgba(245,158,11,0.35)" strokeWidth="1"/>
        <rect x="12" y="14" width="18" height="3" rx="1.5" fill="rgba(251,191,36,0.7)"/>
        <rect x="12" y="20" width="30" height="3" rx="1.5" fill="rgba(251,191,36,0.7)"/>
        <rect x="12" y="26" width="22" height="3" rx="1.5" fill="rgba(251,191,36,0.7)"/>
        <rect x="12" y="32" width="26" height="3" rx="1.5" fill="rgba(251,191,36,0.7)"/>
        <path d="M38 10 L42 18 L34 16 Z" fill="#f59e0b"/>
        <path d="M42 18 L38 26 L34 16 Z" fill="#fbbf24" opacity="0.8"/>
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1px', margin: 0 }}>
          <span style={{ color: '#fff' }}>Resume</span>
          <span style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Spark</span>
        </div>
      </div>
    </div>

    <p style={{ color: '#cbd5e1', fontSize: '1.15rem', marginBottom: '2rem', lineHeight: 1.8 }}>
      Build Better. Apply Smarter. Get Hired Faster.
    </p>

    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
      <p style={{ color: '#94a3b8', marginBottom: '0.7rem', fontSize: '0.95rem' }}>Designed & Engineered by</p>
      <h3 style={{ margin: '0 0 1.5rem', fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg,#38bdf8,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Ch. Sai Reddy 🚀
      </h3>

      {/* Profile boxes */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>

        {/* GitHub */}
<a href="https://github.com/SaiReddy-sm" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1.4rem', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', textDecoration: 'none', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}
  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#e2e8f0">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
  <div style={{ textAlign: 'left' }}>
    <div style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>GitHub</div>
    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#e2e8f0' }}>SaiReddy-sm</div>
  </div>
</a>

{/* LinkedIn */}
<a href="https://www.linkedin.com/in/sai-reddy-sai6134/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0.75rem 1.4rem', borderRadius: '14px', background: 'rgba(10,102,194,0.1)', border: '1px solid rgba(10,102,194,0.25)', textDecoration: 'none', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}
  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(10,102,194,0.2)'; e.currentTarget.style.borderColor = 'rgba(10,102,194,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(10,102,194,0.1)'; e.currentTarget.style.borderColor = 'rgba(10,102,194,0.25)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#38bdf8">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
  <div style={{ textAlign: 'left' }}>
    <div style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase' }}>LinkedIn</div>
    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#e2e8f0' }}>sai-reddy-sai6134</div>
  </div>
</a>

      </div>
    </div>
  </div>

  <p style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem', fontSize: '0.85rem', position: 'relative', zIndex: 2 }}>
    © 2026 ResumeSpark. All rights reserved.
  </p>
</footer>
      {/* 10. SPLIT PREVIEW PANEL OVERLAY */}
      {previewingTemplate && (
        <div 
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(27, 23, 19, 0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
        >
          <div style={{
            backgroundColor: '#ffffff',
            width: '100%',
            maxWidth: '1000px',
            height: '85vh',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <button 
              onClick={() => setPreviewingTemplate(null)}
              onKeyDown={(e) => handleKeyboardPress(e, () => setPreviewingTemplate(null))}
              aria-label="Close template preview modal"
              tabIndex={0}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                backgroundColor: 'var(--slate-100)',
                border: 'none',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                color: 'var(--slate-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', flex: 1, height: '100%', overflow: 'hidden' }}>
              
              {/* LEFT HALF */}
              <div style={{
                flex: 1.1,
                backgroundColor: 'var(--slate-100)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflowY: 'auto',
                borderRight: '1px solid var(--slate-200)'
              }}>
                {renderModalLivePreview(previewingTemplate.id, previewingTemplate.color)}
              </div>

              {/* RIGHT HALF */}
              <div style={{
                flex: 0.9,
                padding: '3.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '1.5rem',
                backgroundColor: 'var(--white)',
                textAlign: 'left'
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: '700', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '99px', textTransform: 'uppercase' }}>
                    {previewingTemplate.category}
                  </span>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--slate-900)', marginTop: '0.75rem', marginBottom: '0.5rem', letterSpacing: '-0.5px', fontFamily: 'Georgia, serif' }}>
                    {previewingTemplate.label}
                  </h2>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {previewingTemplate.desc} This template supports layout structures, margin alterations, paragraph heights, and detail arrangement filters inside your custom sidebar.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                  <button 
                    onClick={() => handleTemplateSelect(previewingTemplate.id)}
                    className="premium-btn"
                    style={{
                      padding: '0.9rem 1.5rem',
                      borderRadius: '10px',
                      fontWeight: '700',
                      fontSize: '0.95rem'
                    }}
                  >
                    Select this Template ✓
                  </button>
                  <button 
                    onClick={() => setPreviewingTemplate(null)}
                    style={{
                      padding: '0.9rem 1.5rem',
                      backgroundColor: 'var(--slate-100)',
                      color: 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: '700',
                      fontSize: '0.95rem',
                      cursor: 'pointer'
                    }}
                  >
                    Keep Browsing Templates
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* DUAL CHOICE STARTING OPTION MODAL (Triggered by CTAs) */}
      {showPromptModal && (
        <div 
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(27, 23, 19, 0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100
          }}
        >
          <div style={{
            backgroundColor: 'var(--white)',
            padding: '2.5rem',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--slate-900)', marginBottom: '0.5rem', letterSpacing: '-0.3px', fontFamily: 'Georgia, serif' }}>
              Resume Editor Launchpad
            </h3>
            

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={handleContinueWithExisting}
                className="premium-btn"
                style={{
                  padding: '0.9rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.95rem'
                }}
              >
                ✏️ Continue with Existing Resume
              </button>
              
              <button 
                onClick={handleStartFreshDefault}
                style={{
                  padding: '0.9rem 1.5rem',
                  backgroundColor: 'var(--white)',
                  color: 'var(--text-secondary)',
                  border: '1.5px solid var(--slate-300)',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                ✨ Start Fresh with Corporate Prime
              </button>

              

              <button 
                onClick={() => setShowPromptModal(false)}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  border: 'none',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STARTING METHOD SELECTION MODAL (Triggered by Specific Template Cards) */}
      {showImportSelection && (
        <div 
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(27, 23, 19, 0.45)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100
          }}
        >
          <div style={{
            backgroundColor: 'var(--white)',
            padding: '2.5rem',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '480px',
            boxShadow: 'var(--shadow-lg)',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--slate-900)', marginBottom: '0.5rem', letterSpacing: '-0.3px', fontFamily: 'Georgia, serif' }}>
              Choose a Starting Method
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.45' }}>
              Fill the sheet with P.Sai Manikanta's sample product metrics to visualize the selected layout, or clear the editor and write from scratch.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={handleChooseSample}
                className="premium-btn"
                style={{
                  padding: '0.9rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.95rem'
                }}
              >
                ✨ Import Sample Data (Recommended)
              </button>
              <button 
                onClick={handleChooseClean}
                style={{
                  padding: '0.9rem 1.5rem',
                  backgroundColor: 'var(--white)',
                  color: 'var(--text-secondary)',
                  border: '1.5px solid var(--slate-300)',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                📝 Start with Clean Sheet
              </button>
              <button 
                onClick={() => setShowImportSelection(false)}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: 'var(--text-muted)',
                  border: 'none',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}