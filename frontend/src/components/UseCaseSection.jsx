import React from 'react';
import { FileText, Brain, BookOpen, BarChart3 } from 'lucide-react';

const UseCaseSection = () => {
  const useCases = [
    {
      icon: FileText,
      title: 'Summarize PDFs quickly',
      description: 'Upload any PDF document and get instant AI-powered summaries with key points and concepts highlighted for efficient studying.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Brain,
      title: 'Generate exam practice quizzes',
      description: 'Create customized practice quizzes based on your study materials to test your knowledge and prepare for exams effectively.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: BookOpen,
      title: 'Create flashcards for memorization',
      description: 'Transform your notes into interactive flashcards with spaced repetition to enhance memory retention and learning efficiency.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Visualize data with graphs',
      description: 'Generate visual representations of complex data and concepts to better understand relationships and patterns in your studies.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 shadow-lg dark:shadow-none">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            How StudyBuddy AI Helps You
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover the powerful ways our AI-powered tools can transform your learning experience
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => {
            const IconComponent = useCase.icon;
            return (
              <div
                key={index}
                className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${useCase.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  {useCase.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg mb-4">
            <span className="font-semibold">Ready to transform your learning?</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Join thousands of students achieving academic success with StudyBuddy AI
          </p>
        </div>
      </div>
    </section>
  );
};

export default UseCaseSection;
