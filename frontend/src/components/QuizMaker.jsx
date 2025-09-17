import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Save, Play, Sparkles, Loader2, Eye, List } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import QuizList from './QuizList';

const QuizMaker = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subject, setSubject] = useState('');
    const [difficulty, setDifficulty] = useState('medium');
    const [questions, setQuestions] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showList, setShowList] = useState(false);

    const subjects = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
        'History', 'Geography', 'Literature', 'Economics', 'Business Studies',
        'Psychology', 'Sociology', 'Philosophy', 'Art', 'Music'
    ];

    const addQuestion = () => {
        setQuestions([...questions, {
            question: '',
            type: 'multiple-choice',
            options: ['', '', '', ''],
            correctAnswer: '',
            explanation: '',
            points: 1
        }]);
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const removeQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const generateQuiz = async () => {
        if (!title.trim() || !subject || questions.length === 0) {
            setError('Please fill in title, subject, and add at least one question');
            return;
        }

        setIsGenerating(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/quizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    subject,
                    difficulty,
                    questions,
                    settings: {
                        randomizeQuestions: true,
                        randomizeOptions: true,
                        showCorrectAnswers: true,
                        allowRetakes: true,
                        passingScore: 70
                    }
                })
            });

            if (response.ok) {
                setSuccess('Quiz created successfully!');
                setTitle('');
                setDescription('');
                setSubject('');
                setQuestions([]);
            } else {
                setError('Failed to create quiz');
            }
        } catch (err) {
            setError('Failed to create quiz');
        } finally {
            setIsGenerating(false);
        }
    };

    const generateAIQuiz = async () => {
        if (!title.trim() || !subject) {
            setError('Please enter a title and select a subject');
            return;
        }

        setIsGenerating(true);
        setError('');
        setSuccess('');

        try {
            // Simulate AI generation
            const mockQuestions = [
                {
                    question: `What is the primary concept of ${title}?`,
                    type: 'multiple-choice',
                    options: [
                        'The fundamental principle',
                        'A secondary concept',
                        'An unrelated idea',
                        'A complex theory'
                    ],
                    correctAnswer: 'The fundamental principle',
                    explanation: 'This is the core concept that forms the foundation of the topic.',
                    points: 1
                },
                {
                    question: `How is ${title} typically applied in ${subject}?`,
                    type: 'multiple-choice',
                    options: [
                        'Through practical examples',
                        'Only in theory',
                        'Never used',
                        'Only in advanced studies'
                    ],
                    correctAnswer: 'Through practical examples',
                    explanation: 'Real-world applications help solidify understanding of the concept.',
                    points: 1
                },
                {
                    question: `What is the most important aspect to remember about ${title}?`,
                    type: 'short-answer',
                    correctAnswer: 'The fundamental principles and applications',
                    explanation: 'Understanding both theory and application is crucial for mastery.',
                    points: 2
                }
            ];

            setQuestions(mockQuestions);
            setSuccess('AI-generated questions added!');
        } catch (err) {
            setError('Failed to generate AI questions');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Quiz Maker
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Create custom quizzes or let AI generate questions for you
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Quiz Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter quiz title"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Subject
                            </label>
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(subj => (
                                    <option key={subj} value={subj}>{subj}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Difficulty
                            </label>
                            <select
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of the quiz"
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <button
                            onClick={addQuestion}
                            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Question
                        </button>
                        
                        <button
                            onClick={generateAIQuiz}
                            disabled={isGenerating || !title.trim() || !subject}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-secondary-600 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4 mr-2" />
                            )}
                            Generate AI Questions
                        </button>
                    </div>

                    <button
                        onClick={generateQuiz}
                        disabled={isGenerating || !title.trim() || !subject || questions.length === 0}
                        className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                                Creating Quiz...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 inline mr-2" />
                                Create Quiz
                            </>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                        <p className="text-red-700 dark:text-red-400">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                        <p className="text-green-700 dark:text-green-400">{success}</p>
                    </div>
                )}

                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Question {qIndex + 1}
                            </h3>
                            <button
                                onClick={() => removeQuestion(qIndex)}
                                className="p-2 text-red-600 hover:text-red-700 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Question
                                </label>
                                <input
                                    type="text"
                                    value={question.question}
                                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                    placeholder="Enter your question"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Question Type
                                </label>
                                <select
                                    value={question.type}
                                    onChange={(e) => updateQuestion(qIndex, 'type', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="multiple-choice">Multiple Choice</option>
                                    <option value="true-false">True/False</option>
                                    <option value="short-answer">Short Answer</option>
                                    <option value="essay">Essay</option>
                                </select>
                            </div>

                            {question.type === 'multiple-choice' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Options
                                    </label>
                                    {question.options.map((option, oIndex) => (
                                        <input
                                            key={oIndex}
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            className="w-full px-4 py-2 mb-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    ))}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Correct Answer
                                </label>
                                <input
                                    type="text"
                                    value={question.correctAnswer}
                                    onChange={(e) => updateQuestion(qIndex, 'correctAnswer', e.target.value)}
                                    placeholder="Enter correct answer"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Explanation (Optional)
                                </label>
                                <textarea
                                    value={question.explanation}
                                    onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                    placeholder="Explain why this is the correct answer"
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Points
                                </label>
                                <input
                                    type="number"
                                    value={question.points}
                                    onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 1)}
                                    min="1"
                                    className="w-20 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizMaker;
