import React from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import AIEngine from '@/components/AIEngine';

import Footer from '@/components/Footer';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero />
        <Features />
        <HowItWorks />
        <AIEngine />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
