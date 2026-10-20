import React, { useState, useEffect } from 'react';
import { ParticleCanvas } from './components/ParticleCanvas';
import { SplashScreen } from './components/SplashScreen';
import { PlatformSelection } from './components/PlatformSelection';
import { ActivationSteps } from './components/ActivationSteps';
import { GameSelection } from './components/GameSelection';
import { ApplePredictor } from './components/ApplePredictor';
import { CrashPredictor } from './components/CrashPredictor';
import { MinesPredictor } from './components/MinesPredictor';
import { sound } from './utils/sound';

type ViewState =
  | 'splash'
  | 'platform_selection'
  | 'settings'
  | 'game_selection'
  | 'apple_game'
  | 'crash_game'
  | 'mines_game';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('splash');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('bizbet');
  const [userId, setUserId] = useState<string>('');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  // Resume Web Audio on first user interaction
  useEffect(() => {
    const handleInteract = () => {
      sound.resume();
      document.removeEventListener('click', handleInteract);
      document.removeEventListener('touchstart', handleInteract);
    };

    document.addEventListener('click', handleInteract);
    document.addEventListener('touchstart', handleInteract);

    return () => {
      document.removeEventListener('click', handleInteract);
      document.removeEventListener('touchstart', handleInteract);
    };
  }, []);

  const handleSplashComplete = () => {
    setCurrentView('platform_selection');
  };

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    setCurrentView('settings');
  };

  const handleVerificationComplete = (confirmedId: string) => {
    setUserId(confirmedId);
    setCurrentView('game_selection');
  };

  const handleSelectGame = (gameId: 'apple' | 'crash' | 'mines') => {
    if (gameId === 'apple') setCurrentView('apple_game');
    else if (gameId === 'crash') setCurrentView('crash_game');
    else if (gameId === 'mines') setCurrentView('mines_game');
  };

  const handleBack = () => {
    if (
      currentView === 'apple_game' ||
      currentView === 'crash_game' ||
      currentView === 'mines_game'
    ) {
      setCurrentView('game_selection');
    } else if (currentView === 'game_selection') {
      setCurrentView('settings');
    } else if (currentView === 'settings') {
      setCurrentView('platform_selection');
    }
  };

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="smart-shell relative min-h-screen w-full bg-[#07080c] text-white overflow-hidden flex flex-col font-sans"
    >
      {/* Dynamic Cyber Particle Background */}
      <ParticleCanvas count={90} />

      {/* Splash Screen Overlay */}
      {currentView === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} language={language} />
      )}

      {/* Main Viewport Container */}
      <div
        className={`fixed inset-0 bg-transparent text-white flex flex-col transition-opacity duration-700 z-10 ${
          currentView === 'splash' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div className="smart-grid absolute inset-0 pointer-events-none" />
          <div className="min-h-full w-full max-w-lg mx-auto relative z-10">
            {(() => {
              switch (currentView) {
                case 'platform_selection':
                  return (
                    <PlatformSelection
                      onSelect={handlePlatformSelect}
                      language={language}
                    />
                  );
                case 'settings':
                  return (
                    <ActivationSteps
                      platform={selectedPlatform}
                      onComplete={handleVerificationComplete}
                      onBack={handleBack}
                      language={language}
                    />
                  );
                case 'game_selection':
                  return (
                    <GameSelection
                      onSelectGame={handleSelectGame}
                      onBack={handleBack}
                      userId={userId || '1849204812'}
                      platform={selectedPlatform}
                    />
                  );
                case 'apple_game':
                  return (
                    <ApplePredictor
                      onBack={handleBack}
                      userId={userId || '1849204812'}
                      platform={selectedPlatform}
                      language={language}
                    />
                  );
                case 'crash_game':
                  return (
                    <CrashPredictor
                      onBack={handleBack}
                      userId={userId || '1849204812'}
                      platform={selectedPlatform}
                    />
                  );
                case 'mines_game':
                  return (
                    <MinesPredictor
                      onBack={handleBack}
                      userId={userId || '1849204812'}
                      platform={selectedPlatform}
                    />
                  );
                default:
                  return null;
              }
            })()}
          </div>
        </main>
      </div>
    </div>
  );
}
