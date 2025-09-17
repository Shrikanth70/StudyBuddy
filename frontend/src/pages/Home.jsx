import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import UseCaseSection from '../components/UseCaseSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';

const Home = ({ onOpenChat, currentUser }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Content wrapper with 95% zoom */}
      <div className="transform scale-95 origin-top">
        {/* Hero Section */}
        <Hero onOpenChat={onOpenChat} currentUser={currentUser} />

        {/* Features Section */}
        <Features />

        {/* Use Case Section */}
        <UseCaseSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Footer Section */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
