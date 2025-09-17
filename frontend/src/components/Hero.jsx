import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Brain, BookOpen, Users, BarChart3, TrendingUp, MessageCircle, X, ChevronRight } from 'lucide-react';

const Hero = () => {
  const { user } = useAuth();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showChatPrompt, setShowChatPrompt] = useState(false);
  const [showGroupPrompt, setShowGroupPrompt] = useState(false);

  const features = [
    {
      icon: MessageCircle,
      title: 'AI Chat Assistant',
      description: 'Get instant answers and explanations from our intelligent AI tutor.',
      details: 'Our AI assistant can answer your questions, explain complex concepts, and provide personalized learning guidance 24/7.',
      color: 'from-blue-500 to-cyan-500',
      stat: '100K+ Conversations',
      requiresAuth: true
    },
    {
      icon: Users,
      title: 'Study Groups',
      description: 'Collaborate with peers in real-time study sessions and share resources.',
      details: 'Join or create study groups where you can share notes, discuss topics, and work together on assignments. Our platform supports real-time collaboration and resource sharing.',
      color: 'from-green-500 to-emerald-500',
      stat: '500+ Active Groups',
      requiresAuth: true
    },
    {
      icon: FileText,
      title: 'AI PDF Analysis',
      description: 'Upload any PDF and get instant AI-powered analysis with key insights.',
      details: 'Our advanced AI analyzes your documents to extract the most important information, creating concise summaries that save you hours of reading time.',
      color: 'from-purple-500 to-pink-500',
      stat: '10K+ PDFs Analyzed'
    },
    {
      icon: Brain,
      title: 'Smart Quizzes',
      description: 'Generate personalized quizzes that adapt to your learning progress.',
      details: 'Create customized quizzes based on your specific study materials. Our AI tracks your progress and adjusts difficulty levels to maximize learning efficiency.',
      color: 'from-orange-500 to-red-500',
      stat: '1M+ Questions Generated'
    },
    {
      icon: BookOpen,
      title: 'Interactive Flashcards',
      description: 'Master complex concepts with intelligent spaced repetition flashcards.',
      details: 'Convert your notes into dynamic flashcards that use proven spaced repetition algorithms to optimize your study sessions.',
      color: 'from-indigo-500 to-blue-500',
      stat: '2M+ Flashcards Created'
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Track your learning progress with detailed analytics and performance charts.',
      details: 'Monitor your study habits, quiz scores, and learning progress with comprehensive analytics and visual charts.',
      color: 'from-teal-500 to-green-500',
      stat: '95% Success Rate'
    }
  ];

  const openFeatureModal = (feature) => {
    if (feature.requiresAuth && !user) {
      if (feature.title === 'AI Chat Assistant') {
        setShowChatPrompt(true);
      } else if (feature.title === 'Study Groups') {
        setShowGroupPrompt(true);
      }
      return;
    }
    setSelectedFeature(feature);
  };

  const closeFeatureModal = () => {
    setSelectedFeature(null);
  };

  const closeAuthPrompt = () => {
    setShowChatPrompt(false);
    setShowGroupPrompt(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Main Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Supercharge Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Learning Journey
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              AI-powered tools that transform how you learn, study, and succeed. 
              From AI chat to collaborative study groups, we've got you covered.
            </p>

            {/* Boost Message */}
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
                <span className="text-lg font-semibold text-green-800 dark:text-green-200">
                  Boost your academic growth by 30% with our AI-powered tools
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {!user ? (
                <>
                  <Link
                    to="/signup"
                    className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Start Learning Free
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/resources"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Go to Dashboard
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">50K+</div>
                <div className="text-gray-600 dark:text-gray-400">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">95%</div>
                <div className="text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">24/7</div>
                <div className="text-gray-600 dark:text-gray-400">AI Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">1M+</div>
                <div className="text-gray-600 dark:text-gray-400">Resources</div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-100 dark:bg-primary-800 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-secondary-100 dark:bg-secondary-800 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-accent-100 dark:bg-accent-800 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Excel Academically
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Our comprehensive suite of AI-powered tools is designed to transform your study experience 
              and help you achieve outstanding academic results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer border border-gray-100 dark:border-gray-700"
                  onClick={() => openFeatureModal(feature)}
                >
                  {/* Feature Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Feature Content */}
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Feature Stat */}
                  <div className="text-center mb-6">
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      {feature.stat}
                    </div>
                  </div>
                  
                  {/* CTA Button */}
                  <button className="w-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 group-hover:shadow-lg">
                    {feature.requiresAuth && !user ? 'Sign In to Access' : 'Explore Feature'}
                    <ChevronRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Growth Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Experience Real
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Academic Growth
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of students who have transformed their learning experience and achieved remarkable results.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-600">30%</div>
              <div className="text-gray-600 dark:text-gray-400">Faster Learning</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-600">45%</div>
              <div className="text-gray-600 dark:text-gray-400">Better Retention</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <BarChart3 className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <div className="text-3xl font-bold text-purple-600">2.5x</div>
              <div className="text-gray-600 dark:text-gray-400">More Efficient</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={closeFeatureModal}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Modal Icon */}
            <div className={`w-16 h-16 bg-gradient-to-r ${selectedFeature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
              {React.createElement(selectedFeature.icon, { className: "w-8 h-8 text-white" })}
            </div>
            
            {/* Modal Content */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              {selectedFeature.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center leading-relaxed">
              {selectedFeature.details}
            </p>
            
            {/* Stat in Modal */}
            <div className="text-center mb-6">
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {selectedFeature.stat}
              </div>
            </div>
            
            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={closeFeatureModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Using Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Prompt Modal - Chat */}
      {showChatPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={closeAuthPrompt}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Sign In to Access AI Chat
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center leading-relaxed">
              Our AI chat assistant is available to all registered users. Sign in or create an account to start chatting with our intelligent tutor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center"
                onClick={closeAuthPrompt}
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 px-6 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300 text-center"
                onClick={closeAuthPrompt}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Auth Prompt Modal - Study Groups */}
      {showGroupPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={closeAuthPrompt}
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Join Study Groups
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center leading-relaxed">
              Study groups are available to registered users. Sign in or create an account to join existing groups or create your own study community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-center"
                onClick={closeAuthPrompt}
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 px-6 py-3 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-all duration-300 text-center"
                onClick={closeAuthPrompt}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
