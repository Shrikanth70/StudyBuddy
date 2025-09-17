import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Computer Science Student',
      quote: 'StudyBuddy AI helped me prepare for my finals in half the time. The AI-generated quizzes were spot on!',
      rating: 5,
      image: '👩‍🎓'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Medical Student',
      quote: 'The flashcard system is incredible. I went from struggling with memorization to acing my anatomy exams.',
      rating: 5,
      image: '👨‍⚕️'
    },
    {
      name: 'Emily Thompson',
      role: 'Business Major',
      quote: 'The PDF summarization feature saved me hours of study time. I can now focus on understanding concepts instead of reading.',
      rating: 5,
      image: '👩‍💼'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800 shadow-lg dark:shadow-none">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            What Students Are Saying
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Join thousands of students who have transformed their learning experience with StudyBuddy AI
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Rating Stars */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* Student Info */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-600 dark:to-purple-600 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {testimonial.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 mb-4">
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Trusted by students worldwide
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Start your journey to academic success today
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
