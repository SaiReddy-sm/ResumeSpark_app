import React, { createContext, useState, useEffect } from 'react';

export const ResumeContext = createContext();

const defaultSectionOrder = ['summary', 'experience', 'education', 'skills', 'languages', 'achievements', 'interests'];

const defaultSectionHeadings = {
  summary: 'Professional Summary',
  experience: 'Experience & Projects',
  education: 'Education History',
  skills: 'Skills & Tools',
  languages: 'Languages',
  achievements: 'Achievements',
  interests: 'Interests'
};

// Default template structure populated with P.Sai Manikanta details (ensuring no blank previews)
const defaultResumeState = {
  personalInfo: {
    fullName: 'P.Sai Manikanta',
    title: 'Senior Full Stack Developer',
    email: 'manikanta.p@gmail.com',
    phone: '+91 91234 56789',
    location: 'Hyderabad, India',
    summary: 'Passionate Full Stack Developer with hands-on experience building responsive web applications using React, Node.js, Express, and MongoDB. Skilled in developing scalable REST APIs, modern user interfaces, and database-driven solutions. Strong problem-solving abilities with a focus on clean code, performance optimization, and delivering real-world software products.',
    image: '',
    linkedin: 'linkedin.com/in/p-manikanta',
    website: 'manikanta.dev',
    nationality: 'Indian',
    dob: '15th January 1997',
    showMoreFields: true
  },
  skills: ['Product Strategy', 'React','Node.js','MongoDB','Express.js', 'Roadmapping', 'SQL Analytics', 'Figma Wireframing', 'Jira & Confluence', 'A/B Testing', 'GTM Strategy'],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Tech in Computer Science & Engineering',
      school: 'BITS Pilani, Hyderabad Campus',
      year: '2021 - 2025',
      marks: '9.1 CGPA'
    },
    {
      id: 'edu-2',
      degree: 'Intermediate (MPC)',
      school: 'Sri Chaitanya Junior College',
      year: '2019 - 2021',
      marks: '95%'
    },
    {
      id: 'edu-3',
      degree: 'SSC',
      school: 'Bhashyam High School',
      year: '2018-2019',
      marks: '10.0 GPA'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Full Stack Developer',
      organization: 'ServiceNow, Hyderabad',
      duration: 'Jan 2021 - Present',
      description: 'Built and deployed responsive MERN stack web applications serving real-world use cases. Developed RESTful APIs using Node.js and Express.js with MongoDB integration.'
    },
    {
      id: 'exp-2',
      title: 'Project Developer',
      organization: 'Darwinbox, Hyderabad',
      duration: 'Jul 2019 - Dec 2020',
      description: 'Designed and developed reusable React UI components for scalable applications.Implemented authentication, CRUD operations, and secure API integrations. Collaborated using Git and GitHub workflows for version control and project management.'
    }
  ],
  achievements: [
    {
      id: 'ach-1',
      name: 'Built and deployed multiple MERN stack projects'
    },
    {
      id: 'ach-2',
      name: 'Completed Full Stack Development Internship'
    }
  ],
  languages: [
    { id: 'lang-1', name: 'English', level: 'Fluent' },
    { id: 'lang-2', name: 'Telugu', level: 'Native' },
    { id: 'lang-3', name: 'Hindi', level: 'Professional' }
  ],
  interests: [
    'Web Development',
    'Open Source',
    'Artificial Intelligence'
  ],
  customSections: [
    {
      id: 'cust-1',
      title: 'Certifications',
      content: '• CSPO — Scrum Alliance (2021)\n• Google PM Certificate (2019)'
    }
  ],
  template: 'corporate_prime',
  enableSecondPage: false,
  customization: {
    headerAlignment: 'left',
    detailsArrangement: 'pipe',
    iconStyle: 'circle_filled',
    nameStyle: 'bold',
    fontFamily: 'body',
    accentColor: '#1e2e47',
    margins: 'comfortable',
    lineSpacing: 'regular',
    photoSize: 80,
    sectionOrder: [...defaultSectionOrder, 'cust-1'],
    sectionHeadings: { ...defaultSectionHeadings }
  },
  resumeName: 'Resume 1'
};

export const ResumeProvider = ({ children }) => {
  const [view, setView] = useState('landing');
  const [previewingTemplate, setPreviewingTemplate] = useState(null);
  const [showImportSelection, setShowImportSelection] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  const [resumeData, setResumeData] = useState(() => {
    try {
      const saved = localStorage.getItem('flowspark_data_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        const mergedCustomization = {
          ...defaultResumeState.customization,
          ...(parsed.customization || {})
        };

        if (mergedCustomization.photoSize === undefined) {
          mergedCustomization.photoSize = defaultResumeState.customization.photoSize;
        }

        if (!mergedCustomization.sectionOrder) {
          const parsedCustoms = parsed.customSections || [];
          mergedCustomization.sectionOrder = [
            ...defaultSectionOrder,
            ...parsedCustoms.map(c => c.id)
          ];
        }

        if (!mergedCustomization.sectionHeadings) {
          mergedCustomization.sectionHeadings = { ...defaultSectionHeadings };
        }

        return {
          ...defaultResumeState,
          ...parsed,
          personalInfo: {
            ...defaultResumeState.personalInfo,
            ...(parsed.personalInfo || {})
          },
          customization: mergedCustomization
        };
      }
    } catch (e) {
      console.warn("Local storage lookup failed, loading defaults.");
    }
    return defaultResumeState;
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    try {
      localStorage.setItem('flowspark_data_v3', JSON.stringify(resumeData));
    } catch (e) {
      console.warn("Local storage write blocked.");
    }
  }, [resumeData]);

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const updateCustomization = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      customization: { ...prev.customization, [field]: value }
    }));
  };

  const updateSectionHeading = (sectionKey, newHeading) => {
    setResumeData(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        sectionHeadings: {
          ...(prev.customization?.sectionHeadings || defaultSectionHeadings),
          [sectionKey]: newHeading
        }
      }
    }));
  };

  const updateResumeName = (name) => {
    setResumeData(prev => ({ ...prev, resumeName: name }));
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (resumeData.skills.includes(trimmed)) {
      showNotification('Skill already in list', 'info');
      return;
    }
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
    showNotification(`Added skill: "${trimmed}"`);
  };

  const removeSkill = (skillToRemove) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
    showNotification('Skill removed');
  };

  const addEducation = (edu) => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, { ...edu, id: `edu-${Date.now()}` }]
    }));
    showNotification('Added education record');
  };

  const removeEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
    showNotification('Removed education');
  };

  const addExperience = (exp) => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, { ...exp, id: `exp-${Date.now()}` }]
    }));
    showNotification('Added experience block');
  };

  const removeExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
    showNotification('Removed experience');
  };

  const addLanguage = (lang) => {
    setResumeData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), { ...lang, id: `lang-${Date.now()}` }]
    }));
    showNotification(`Added language: "${lang.name}"`);
  };

  const removeLanguage = (id) => {
    setResumeData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter(l => l.id !== id && l.name !== id)
    }));
    showNotification('Language removed');
  };

  const addInterest = (interest) => {
    const trimmed = interest.trim();
    if (!trimmed) return;
    if ((resumeData.interests || []).includes(trimmed)) return;
    setResumeData(prev => ({
      ...prev,
      interests: [...(prev.interests || []), trimmed]
    }));
    showNotification(`Added interest: "${trimmed}"`);
  };

  const removeInterest = (interest) => {
    setResumeData(prev => ({
      ...prev,
      interests: (prev.interests || []).filter(i => i !== interest)
    }));
    showNotification('Interest removed');
  };

  const addAchievement = (ach) => {
    const trimmed = ach.trim();
    if (!trimmed) return;
    setResumeData(prev => ({
      ...prev,
      achievements: [...(prev.achievements || []), { id: `ach-${Date.now()}`, name: trimmed }]
    }));
    showNotification('Achievement added');
  };

  const removeAchievement = (achToRemove) => {
    setResumeData(prev => ({
      ...prev,
      achievements: (prev.achievements || []).filter(a => {
        const name = typeof a === 'object' ? a.name : a;
        const target = typeof achToRemove === 'object' ? achToRemove.name : achToRemove;
        return name !== target && a.id !== achToRemove;
      })
    }));
    showNotification('Achievement removed');
  };

  const addCustomSection = (section) => {
    const id = `cust-${Date.now()}`;
    setResumeData(prev => {
      const updatedCustomSections = [...prev.customSections, { ...section, id }];
      const currentOrder = prev.customization.sectionOrder || [...defaultSectionOrder];
      const updatedOrder = currentOrder.includes(id) ? currentOrder : [...currentOrder, id];
      
      return {
        ...prev,
        customSections: updatedCustomSections,
        customization: {
          ...prev.customization,
          sectionOrder: updatedOrder
        }
      };
    });
    showNotification('Custom section added');
  };

  const removeCustomSection = (id) => {
    setResumeData(prev => {
      const updatedCustomSections = prev.customSections.filter(sec => sec.id !== id);
      const currentOrder = prev.customization.sectionOrder || [...defaultSectionOrder];
      const updatedOrder = currentOrder.filter(item => item !== id);
      
      return {
        ...prev,
        customSections: updatedCustomSections,
        customization: {
          ...prev.customization,
          sectionOrder: updatedOrder
        }
      };
    });
    showNotification('Custom section removed');
  };

  const selectTemplateLayout = (templateName) => {
    setResumeData(prev => ({ ...prev, template: templateName }));
  };

  const toggleSecondPage = (enable) => {
    setResumeData(prev => ({ ...prev, enableSecondPage: enable }));
    showNotification(enable ? 'Second Page Enabled' : 'Single Page Layout Restored', 'info');
  };

  const clearResume = (templateId) => {
    setResumeData({
      ...defaultResumeState,
      template: templateId || defaultResumeState.template
    });
    showNotification('All sections reset!', 'info');
  };

  const loadSampleData = (templateId) => {
    setResumeData({
      ...defaultResumeState,
      template: templateId || defaultResumeState.template
    });
    showNotification('Sample data populated!', 'success');
  };

  // Safe manual data backup parser
  const importResumeData = (jsonData) => {
    try {
      const imported = {
        ...defaultResumeState,
        ...jsonData,
        personalInfo: {
          ...defaultResumeState.personalInfo,
          ...(jsonData.personalInfo || {})
        },
        customization: {
          ...defaultResumeState.customization,
          ...(jsonData.customization || {})
        }
      };
      setResumeData(imported);
      showNotification('Resume backup imported successfully!', 'success');
      return true;
    } catch (err) {
      showNotification('Parsing failed. Invalid file structure.', 'danger');
      return false;
    }
  };

  const getDynamicSuggestions = () => [];

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        view,
        setView,
        previewingTemplate,
        setPreviewingTemplate,
        showImportSelection,
        setShowImportSelection,
        activeTab,
        setActiveTab,
        toast,
        updatePersonalInfo,
        updateCustomization,
        updateSectionHeading,
        updateResumeName,
        addSkill,
        removeSkill,
        addEducation,
        removeEducation,
        addExperience,
        removeExperience,
        addLanguage,
        removeLanguage,
        addInterest,
        removeInterest,
        addAchievement,
        removeAchievement,
        addCustomSection,
        removeCustomSection,
        selectTemplateLayout,
        toggleSecondPage,
        clearResume,
        loadSampleData,
        importResumeData, // Exported backup parser
        getDynamicSuggestions,
        showNotification
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};