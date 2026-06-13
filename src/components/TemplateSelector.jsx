import React, { useContext, useState } from 'react';
import { ResumeContext } from '../context/ResumeContext';

export default function TemplateSelector() {
  const { resumeData, selectTemplateLayout, updateCustomization } = useContext(ResumeContext);
  const [hoveredId, setHoveredId] = useState(null);

  // Active customization options
  const activeTemplate = resumeData.template || 'classic_scholar';
  const activeAccentColor = resumeData.customization?.accentColor || '#1e2e47';

  // Template registry defining layout metadata
  const templates = [
    {
      id: 'corporate_prime',
      name: 'Corporate Prime',
      category: 'Professional',
      description: 'Traditional single-column layout with a prominent header accent bar and bold visual hierarchy.',
      layoutType: 'banner-top'
    },
    {
      id: 'classic_scholar',
      name: 'Classic Scholar',
      category: 'Academic',
      description: 'Clean, elegant single-column architecture optimized for technical, medical, and academic roles.',
      layoutType: 'classic-single'
    },
    {
      id: 'creative_sidebar',
      name: 'Creative Sidebar',
      category: 'Creative',
      description: 'Asymmetric split design featuring a structural sidebar for contact details and key highlights.',
      layoutType: 'sidebar-left'
    },
    {
      id: 'modern_minimalist',
      name: 'Modern Minimalist',
      category: 'Minimalist',
      description: 'Ultra-clean layout prioritizing balanced white space, modern grid alignments, and clean details.',
      layoutType: 'asymmetric'
    }
  ];

  // Distinct coloring per category badge
  const getCategoryBadgeStyle = (category) => {
    const baseStyle = {
      fontSize: '0.68rem',
      fontWeight: '700',
      padding: '0.2rem 0.5rem',
      borderRadius: '9999px',
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
      display: 'inline-block'
    };

    switch (category) {
      case 'Professional':
        return { ...baseStyle, backgroundColor: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe' };
      case 'Academic':
        return { ...baseStyle, backgroundColor: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
      case 'Creative':
        return { ...baseStyle, backgroundColor: '#faf5ff', color: '#6b21a8', border: '1px solid #e9d5ff' };
      case 'Minimalist':
        return { ...baseStyle, backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' };
      default:
        return { ...baseStyle, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
    }
  };

  // Pre-configured color presets to quick-switch colors right inside selector
  const colorPresets = [
    { name: 'Slate Blue', hex: '#1e2e47' },
    { name: 'Deep Emerald', hex: '#0f5132' },
    { name: 'Crimson Burgundy', hex: '#842029' },
    { name: 'Amethyst Purple', hex: '#5c10a3' },
    { name: 'Charcoal Obsidian', hex: '#212529' }
  ];

  // Helper component to render mini visual layouts dynamically
  const MockupPreview = ({ layoutType, accent }) => {
    const paperStyle = {
      width: '100%',
      height: '140px',
      backgroundColor: '#ffffff',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      padding: '8px',
      boxSizing: 'border-box',
      gap: '6px'
    };

    const blockLine = (width, height = '4px', bg = '#e2e8f0') => ({
      width,
      height,
      backgroundColor: bg,
      borderRadius: '2px'
    });

    switch (layoutType) {
      case 'banner-top':
        return (
          <div style={paperStyle}>
            {/* Header Strip in Accent Color */}
            <div style={{ height: '16px', backgroundColor: accent, width: '100%', margin: '-8px -8px 6px -8px', position: 'relative' }}>
              {/* Overlapping Avatar Dot */}
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#e2e8f0', border: `1.5px solid ${accent}`, position: 'absolute', bottom: '-6px', left: '12px' }} />
            </div>
            <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '2px' }}>
              <div style={blockLine('55%', '5px', '#94a3b8')} />
              <div style={blockLine('35%', '3px', '#cbd5e1')} />
            </div>
            {/* Divider Line Accent */}
            <div style={blockLine('100%', '1px', accent)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={blockLine('80%')} />
              <div style={blockLine('90%')} />
              <div style={blockLine('45%')} />
            </div>
          </div>
        );

      case 'sidebar-left':
        return (
          <div style={{ ...paperStyle, flexDirection: 'row', padding: 0 }}>
            {/* Left Sidebar */}
            <div style={{ width: '30%', backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '8px', gap: '6px', alignItems: 'center' }}>
              {/* Avatar Dot in Accent Color */}
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: accent }} />
              <div style={blockLine('80%', '3px')} />
              <div style={blockLine('60%', '3px')} />
              <div style={blockLine('70%', '3px')} />
            </div>
            {/* Right main column */}
            <div style={{ width: '70%', display: 'flex', flexDirection: 'column', padding: '8px', gap: '6px' }}>
              <div style={blockLine('60%', '5px', '#94a3b8')} />
              {/* Small accent lines simulating headers */}
              <div style={blockLine('40%', '3px', accent)} />
              <div style={blockLine('100%')} />
              <div style={blockLine('90%')} />
              <div style={blockLine('40%', '3px', accent)} />
              <div style={blockLine('85%')} />
            </div>
          </div>
        );

      case 'asymmetric':
        return (
          <div style={paperStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%' }}>
                <div style={blockLine('40%', '6px', '#475569')} />
                <div style={blockLine('25%', '3px', '#94a3b8')} />
              </div>
              {/* Minimal Dot Accent */}
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: accent }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <div style={{ width: '3px', backgroundColor: accent, borderRadius: '1.5px', height: '70px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                <div style={blockLine('50%', '4px', '#cbd5e1')} />
                <div style={blockLine('95%')} />
                <div style={blockLine('90%')} />
                <div style={blockLine('30%', '4px', '#cbd5e1')} />
                <div style={blockLine('85%')} />
              </div>
            </div>
          </div>
        );

      case 'classic-single':
      default:
        return (
          <div style={paperStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', alignItems: 'center', textAlign: 'center' }}>
              <div style={blockLine('50%', '6px', '#1e293b')} />
              <div style={blockLine('70%', '3px')} />
            </div>
            {/* Divider Strip */}
            <div style={blockLine('100%', '2px', accent)} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={blockLine('40%', '4px', '#64748b')} />
                <div style={blockLine('20%', '4px', '#94a3b8')} />
              </div>
              <div style={blockLine('95%')} />
              <div style={blockLine('85%')} />
              <div style={blockLine('100%')} />
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Dynamic Color Palette Swapper */}
      <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', margin: '0 0 0.25rem 0' }}>Accent Palette</h4>
        <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0 0 0.85rem 0' }}>
          Select an executive signature color to instantly re-style line accents, headers, and bullet points on templates.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {colorPresets.map((preset) => (
            <button
              key={preset.hex}
              onClick={() => updateCustomization('accentColor', preset.hex)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: preset.hex,
                border: activeAccentColor.toLowerCase() === preset.hex.toLowerCase() ? '2px solid #ffffff' : '1px solid rgba(0,0,0,0.1)',
                boxShadow: activeAccentColor.toLowerCase() === preset.hex.toLowerCase() ? `0 0 0 2.5px ${preset.hex}` : 'none',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              title={preset.name}
            />
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Custom Hex:</span>
            <input 
              type="color" 
              value={activeAccentColor} 
              onChange={(e) => updateCustomization('accentColor', e.target.value)} 
              style={{ border: 'none', background: 'transparent', width: '24px', height: '24px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Differentiated Layout Previews */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {templates.map((tpl) => {
          const isActive = activeTemplate === tpl.id;
          const isHovered = hoveredId === tpl.id;

          // Combined Card styles for active, hover, and default states
          const cardStyle = {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: isActive ? `2px solid ${activeAccentColor}` : '2px solid #e2e8f0',
            boxShadow: isActive 
              ? `0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 0 0 3px ${activeAccentColor}1a` 
              : isHovered 
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)'
                : '0 1px 3px rgba(0, 0, 0, 0.02)',
            transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            padding: '1rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            textAlign: 'left'
          };

          return (
            <div
              key={tpl.id}
              style={cardStyle}
              onClick={() => selectTemplateLayout(tpl.id)}
              onMouseEnter={() => setHoveredId(tpl.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Category Badge & Top Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={getCategoryBadgeStyle(tpl.category)}>{tpl.category}</span>
                {isActive && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: activeAccentColor, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    Active
                  </span>
                )}
              </div>

              {/* Layout Blueprint Box */}
              <div style={{ position: 'relative' }}>
                <MockupPreview layoutType={tpl.layoutType} accent={activeAccentColor} />
                
                {/* Active checkmark overlay */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: activeAccentColor,
                    color: '#ffffff',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    border: '1.5px solid #ffffff'
                  }}>
                    ✓
                  </div>
                )}
              </div>

              {/* Text Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#1e293b' }}>
                  {tpl.name}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: '1.4' }}>
                  {tpl.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}