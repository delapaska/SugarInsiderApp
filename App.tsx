

import React, { useState, useEffect } from 'react';
import OnboardingScreen from './OnboardingScreen';
import DiaryScreen from './DiaryScreen';
import { Language } from './translations';
import { preloadAssets } from './AssetHelper';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'diary'>('onboarding');
  const [language] = useState<Language>('English');

  // Preload assets on app start for better performance
  useEffect(() => {
    preloadAssets().catch(error => {
      console.warn('Failed to preload some assets:', error);
    });
  }, []);

  const navigateToScreen = (screen: 'onboarding' | 'diary') => {
    setCurrentScreen(screen);
  };

  if (currentScreen === 'diary') {
    return <DiaryScreen onAccountDeleted={() => navigateToScreen('onboarding')} />;
  }

  return <OnboardingScreen onNavigate={navigateToScreen} language={language} />;
}

export default App;
