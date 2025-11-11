
'use client';

import { useState, useEffect } from 'react';

export const defaultStyles = {
  primaryColor: '#4B0082',
  textColor: '#333333',
  headingFont: 'default',
  bodyFont: 'default',
  headingFontSize: 36,
  subheadingFontSize: 20,
  bodyFontSize: 11,
};

export type ResumeStyles = typeof defaultStyles;

const getInitialState = (): ResumeStyles => {
  if (typeof window === 'undefined') {
    return defaultStyles;
  }
  try {
    const item = window.localStorage.getItem('resumeStyles');
    if (item) {
      const parsed = JSON.parse(item);
      // Basic validation and merging with defaults to handle new fields
      return { ...defaultStyles, ...parsed };
    }
    return defaultStyles;
  } catch (error) {
    console.error('Error reading styles from localStorage', error);
    return defaultStyles;
  }
};

export function useResumeStyles() {
  const [styles, setStyles] = useState<ResumeStyles>(defaultStyles);

  useEffect(() => {
    setStyles(getInitialState());
  }, []);

  useEffect(() => {
    try {
      const dataString = JSON.stringify(styles);
      window.localStorage.setItem('resumeStyles', dataString);
    } catch (error) {
      console.error('Error writing styles to localStorage', error);
    }
  }, [styles]);

  const resetStyles = () => {
    setStyles(defaultStyles);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('resumeStyles');
    }
  };

  return { styles, setStyles, resetStyles, defaultStyles };
}

    