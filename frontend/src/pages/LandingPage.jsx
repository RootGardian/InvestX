import React from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import SocialProofSection from '../components/landing/SocialProofSection';

const LandingPage = () => {
  return (
    <main className="flex-grow">
      <HeroSection />
      <SocialProofSection />
      <FeaturesSection />
    </main>
  );
};

export default LandingPage;
