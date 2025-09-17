import React, { useState } from 'react';
import { Upload, FileText, Brain, BookOpen, FileQuestion, Sparkles, X } from 'lucide-react';
import NotesGenerator from './NotesGenerator';
import Flashcards from './Flashcards';
import QuizMaker from './QuizMaker';

const ResourcesPage = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    setLoading(true);
    
    // Simulate file processing
    setTimeout(() => {
      const newFiles = files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        uploadDate: new Date().toLocaleDateString(),
        content: 'Sample extracted text content...'
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setLoading(false);
    }, 1500);
  };

  const tabs = [
    { id: 'upload', label: 'Upload Resources', icon: Upload },
    { id: 'notes', label: 'Generate Notes', icon: FileText },
    { id: 'flashcards', label: 'Create Flashcards', icon: Brain },
    { id: 'quiz', label: 'Generate Quiz', icon: FileQuestion },
  ];

  const features = [
    {
      id: 'summarization',
      title: 'AI Summarization',
      icon: Sparkles,
      color: 'purple',
      shortDescription: 'Get concise summaries of lengthy documents in seconds',
      fullDescription: 'Our AI summarization tool analyzes your study materials and extracts the most important information, creating concise summaries that capture key concepts and main ideas. Perfect for quickly reviewing complex topics before exams or understanding lengthy research papers.'
    },
    {
      id: 'quizzes',
      title: 'Smart Quizzes',
      icon: Brain,
      color: 'green',
      shortDescription: 'Generate personalized quizzes based on your study materials',
      fullDescription: 'Transform your study materials into interactive quizzes that test your understanding. Our AI generates multiple-choice questions, true/false statements, and fill-in-the-blank exercises tailored to your specific content. Track your progress and identify areas that need more focus.'
    },
    {
      id: 'flashcards',
      title: 'Flashcards',
      icon: BookOpen,
      color: 'blue',
      shortDescription: 'Create interactive flashcards for effective memorization',
      fullDescription: 'Automatically generate digital flashcards from your study materials. Our system creates question-answer pairs, key term definitions, and concept explanations. Use spaced repetition algorithms to optimize your learning and improve long-term retention of information.'
    }
  ];

  const openFeatureModal = (feature) => {
    setSelectedFeature(feature);
  };

  const closeFeatureModal = () => {
    setSelectedFeature(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Study Resources Hub
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload, analyze, and transform your study materials with AI
          </p>
        </div>

        {/* Feature Cards Section - Moved below heading tagline */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => openFeatureModal(feature)}
                className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md cursor-pointer hover:shadow-lg transition-all duration-200 hover:transform hover:-translate-y-1"
              >
                <IconComponent className={`h-8 w-8 text-${feature.color}-600 mb-3`} />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.shortDescription}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 mt-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
          {activeTab === 'upload' && (
            <div>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Upload your study materials
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Drag & drop or click to select PDFs, images, or text files
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.txt,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose Files
                </label>
              </div>

              {loading && (
                <div className="mt-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Processing files...</p>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Uploaded Files
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {uploadedFiles.map(file => (
                      <div key={file.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {file.name}
                            </h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {file.size} • {file.uploadDate}
                            </p>
                          </div>
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {file.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && <NotesGenerator />}
          {activeTab === 'flashcards' && <Flashcards />}
          {activeTab === 'quiz' && <QuizMaker />}
        </div>
      </div>

      {/* Feature Modal */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {React.createElement(selectedFeature.icon, {
                    className: `h-8 w-8 text-${selectedFeature.color}-600`
                  })}
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedFeature.title}
                  </h2>
                </div>
                <button
                  onClick={closeFeatureModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {selectedFeature.fullDescription}
                </p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeFeatureModal}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
