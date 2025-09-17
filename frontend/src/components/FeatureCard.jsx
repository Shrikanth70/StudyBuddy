import React, { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, color, features, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`feature-card group cursor-pointer overflow-hidden relative ${
        isHovered ? 'scale-105' : ''
      } transition-all duration-500 ease-out`}
      style={{
        animationDelay: `${index * 0.1}s`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      {/* Shimmer Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000`} />
      
      {/* Icon */}
      <div className="text-center mb-6 relative z-10">
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="text-center relative z-10">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 transition-colors duration-300 font-['Poppins']">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Feature List */}
        <div className="space-y-2 mb-6">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Learn More Button */}
        <button className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium group-hover:translate-x-1 transition-all duration-300">
          <span>Learn More</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
      </div>
      
      <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '0.5s' }}>
        <div className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-pulse" />
      </div>

      {/* Corner Accent */}
      <div className={`absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-${color.split('-')[1]}-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </div>
  );
};

export default FeatureCard;
