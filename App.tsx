

import React, { useState } from 'react';
import OnboardingScreen from './OnboardingScreen';
import DiaryScreen from './DiaryScreen';
import { Language } from './translations';

function App() {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'diary'>('onboarding');
  const [language] = useState<Language>('English');

  const navigateToScreen = (screen: 'onboarding' | 'diary') => {
    setCurrentScreen(screen);
  };

  if (currentScreen === 'diary') {
    return <DiaryScreen onAccountDeleted={() => navigateToScreen('onboarding')} />;
  }

  return <OnboardingScreen onNavigate={navigateToScreen} language={language} />;
}

export default App;
