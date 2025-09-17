import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  const { isDark } = useTheme();

  return (
    <footer className={`bg-gradient-to-r ${isDark ? 'from-gray-900 to-gray-800' : 'from-white to-white'} ${isDark ? 'text-white' : 'text-gray-900'} py-12 mt-auto`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              StudyBuddy AI
            </h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm leading-relaxed`}>
              Your intelligent study companion powered by <b>cutting-edge AI technology</b>. <br /> 
              Transform your learning experience with personalized notes, smart quizzes, and collaborative study groups.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className={`${isDark ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-400 transition-colors duration-200`}>Home</a></li>
              <li><a href="/resources" className={`${isDark ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-400 transition-colors duration-200`}>Resources</a></li>
              <li><a href="/study-groups" className={`${isDark ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-400 transition-colors duration-200`}>Study Groups</a></li>
              <li><a href="/login" className={`${isDark ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-400 transition-colors duration-200`}>Login</a></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Connect With Us</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>studybuddy@gmail.com</p>
            <div className="flex space-x-4">
              <a href="#" className={`${isDark ? 'text-gray-300' : 'text-gray-600'} hover:text-pink-400 transition-colors duration-200`}>
                <FaInstagram size={24} />
              </a>
              <a href="#" className={`${isDark ? 'text-gray-300' : 'text-gray-600'} hover:text-blue-400 transition-colors duration-200`}>
                <FaLinkedin size={24} />
              </a>
              <a href="#" className={`${isDark ? 'text-gray-300' : 'text-gray-600'} hover:text-gray-400 transition-colors duration-200`}>
                <FaGithub size={24} />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>Stay Updated</h3>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>Get the latest features and updates</p>
            <div className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500'} border focus:outline-none focus:border-blue-400 transition-colors duration-200`}
              />
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-300'} mt-8 pt-8 text-center`}>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
            © 2025 StudyBuddy AI. All rights reserved. Built with ❤️ by Shrikanth.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
