import React from 'react';
import { Link } from 'react-router-dom';
import FeatureCard from './FeatureCard';
import { 
  FileText, 
  StickyNote, 
  Users,
  Sparkles,
  Zap
} from 'lucide-react';

const Features = () => {
const features = [
    {
      icon: FileText,
      title: 'Summarization',
      description: 'Upload any PDF and get instant summaries, key points, and detailed analysis with AI-powered insights.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: StickyNote,
      title: 'Quizzes',
      description: 'Generate customized practice quizzes based on your study materials to test your knowledge and prepare for exams effectively.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Users,
      title: 'Flashcards',
      description: 'Transform your notes into interactive flashcards with spaced repetition to enhance memory retention and learning efficiency.',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800 shadow-lg dark:shadow-none relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary-200/20 to-transparent rounded-full blur-3xl" />
        {/* Removed red gradient circle below */}
        {/* <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-secondary-200/20 to-transparent rounded-full blur-3xl" /> */}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 mb-6">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Powerful Features
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text font-['Poppins']">
            Everything You Need to Excel
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the comprehensive suite of AI-powered tools designed to transform your learning experience 
            and help you achieve your academic goals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <Link 
              key={index}
              to={`/${feature.title.replace(/\s+/g, '-').toLowerCase()}`}
              className="block hover:no-underline transform hover:scale-105 transition-transform duration-300"
            >
              <FeatureCard
                {...feature}
                index={index}
              />
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-full shadow-lg">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">Ready to get started?</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mt-4 mb-8">
            Join thousands of students already using StudyBuddy AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn btn-primary">
              🚀 Start Free Trial
            </button>
            <button className="btn btn-secondary">
              📖 View Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
