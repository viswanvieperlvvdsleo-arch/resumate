

'use client';

import { useState, useEffect } from 'react';
import type { ResumeData } from '@/types/resume';

const initialData: ResumeData = {
  fullName: '',
  title: '',
  about: '',
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certificates: [],
  customSections: [],
  contact: {
    email: '',
    phone: '',
    linkedin: '',
    github: '',
  },
  profilePicture: '',
  address: '',
  references: [],
};

const getInitialState = (): ResumeData => {
  if (typeof window === 'undefined') {
    return initialData;
  }
  try {
    const item = window.localStorage.getItem('resumeData');
    if (item) {
        const parsed = JSON.parse(item);
        // Basic validation
        if(parsed.fullName !== undefined && parsed.contact !== undefined) {
            // Ensure new fields exist and have correct types
            if (!parsed.experience) parsed.experience = [];
            if (!parsed.profilePicture) parsed.profilePicture = '';
            if (!parsed.address) parsed.address = '';
            if (!parsed.references) parsed.references = [];
            if (!parsed.certificates) parsed.certificates = [];
            if (!parsed.customSections) parsed.customSections = [];
            if (Array.isArray(parsed.customSections)) {
                parsed.customSections.forEach((section: any) => {
                    if (!section.icon) section.icon = 'briefcase';
                });
            }
            if (!Array.isArray(parsed.skills) || (parsed.skills.length > 0 && typeof parsed.skills[0] === 'string')) {
                parsed.skills = [];
            }

            return parsed;
        }
    }
    return initialData;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return initialData;
  }
};

export function useResumeData() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialData);

  // Load from localStorage on mount
  useEffect(() => {
    setResumeData(getInitialState());
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    try {
      if(resumeData === initialData && !window.localStorage.getItem('resumeData')) {
        // Don't save initial data on first load if nothing is stored yet.
        const isEmpty = Object.values(resumeData).every(value => {
            if (Array.isArray(value)) return value.length === 0;
            if (typeof value === 'object' && value !== null) {
                 return Object.values(value).every(v => v === '');
            }
            return value === '';
        });
        if(isEmpty) return;
      }
      const dataString = JSON.stringify(resumeData);
      window.localStorage.setItem('resumeData', dataString);
    } catch (error) {
      console.error('Error writing to localStorage', error);
    }
  }, [resumeData]);

  return { resumeData, setResumeData };
}
