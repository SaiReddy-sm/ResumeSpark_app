const STORAGE_KEY = "resumeData";

export function saveResume(resumeData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
}

export function getResume() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return null;
  }

  return JSON.parse(savedData);
}