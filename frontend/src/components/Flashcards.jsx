import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, Save, Play, Sparkles, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Flashcards = () => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('intermediate');
    const [cards, setCards] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [studyMode, setStudyMode] = useState(false);
    const [currentCard, setCurrentCard] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const subjects = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
        'History', 'Geography', 'Literature', 'Economics', 'Business Studies',
        'Psychology', 'Sociology', 'Philosophy', 'Art', 'Music'
    ];

    const addCard = () => {
        setCards([...cards, {
            front: '',
            back: '',
            hint: '',
            difficulty: 'medium',
            tags: []
        }]);
    };

    const updateCard = (index, field, value) => {
        const newCards = [...cards];
        newCards[index][field] = value;
        setCards(newCards);
    };

    const removeCard = (index) => {
        setCards(cards.filter((_, i) => i !== index));
    };

    const generateFlashcards = async () => {
        if (!title.trim() || !subject || cards.length === 0) {
            setError('Please fill in title, subject, and add at least one card');
            return;
        }

        setIsGenerating(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:5000/api/flashcards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title,
                    subject,
                    topic: topic || title,
                    difficulty,
                    cards,
                    settings: {
                        randomizeOrder: true,
                        showHints: true,
                        reverseCards: false
                    }
                })
            });

            if (response.ok) {
                setSuccess('Flashcards created successfully!');
                setTitle('');
                setSubject('');
                setTopic('');
                setCards([]);
            } else {
                setError('Failed to create flashcards');
            }
        } catch (err) {
            setError('Failed to create flashcards');
        } finally {
            setIsGenerating(false);
        }
    };

    const generateAIFlashcards = async () => {
        if (!title.trim() || !subject) {
            setError('Please enter a title and select a subject');
            return;
        }

        setIsGenerating(true);
        setError('');
        setSuccess('');

        try {
            // Simulate AI generation
            const mockCards = [
                {
                    front: `What is ${title}?`,
                    back: `${title} is a fundamental concept in ${subject} that involves...`,
                    hint: 'Think about the basic definition',
                    difficulty: 'easy',
                    tags: ['definition', 'basic']
                },
                {
                    front: `What are the key components of ${title}?`,
                    back: 'The key components include: 1) Primary elements, 2) Supporting concepts, 3) Practical applications',
                    hint: 'Consider the main parts that make up this concept',
                    difficulty: 'medium',
                    tags: ['components', 'structure']
                },
                {
                    front: `How is ${title} applied in real-world scenarios?`,
                    back: `${title} is applied through practical examples, problem-solving approaches, and case studies...`,
                    hint: 'Think about practical uses and examples',
                    difficulty: 'hard',
                    tags: ['application', 'real-world']
                }
            ];

            setCards(mockCards);
            setSuccess('AI-generated flashcards added!');
        } catch (err) {
            setError('Failed to generate AI flashcards');
        } finally {
            setIsGenerating(false);
        }
    };

    const startStudyMode = () => {
        if (cards.length === 0) {
            setError('Add some flashcards first!');
            return;
        }
        setStudyMode(true);
        setCurrentCard(0);
        setShowAnswer(false);
    };

    const nextCard = () => {
        if (currentCard < cards.length - 1) {
            setCurrentCard(currentCard + 1);
            setShowAnswer(false);
        }
    };

    const prevCard = () => {
        if (currentCard > 0) {
            setCurrentCard(currentCard - 1);
            setShowAnswer(false);
        }
    };

    if (studyMode) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Study Mode
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Card {currentCard + 1} of {cards.length}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
                        <div className="text-center">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    {!showAnswer ? 'Question' : 'Answer'}
                                </h2>
                                <div className="min-h-[200px] flex items-center justify-center">
                                    <p className="text-lg text-gray-700 dark:text-gray-300">
                                        {!showAnswer ? cards[currentCard].front : cards[currentCard].back}
                                    </p>
                                </div>
                            </div>

                            {!showAnswer && cards[currentCard].hint && (
                                <div className="mb-4 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <p className="text-sm text-blue-700 dark:text-blue-400">
                                        <strong>Hint:</strong> {cards[currentCard].hint}
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-center space-x-4">
                                {!showAnswer ? (
                                    <button
                                        onClick={() => setShowAnswer(true)}
                                        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                    >
                                        Show Answer
                                    </button>
                                ) : (
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => setShowAnswer(false)}
                                            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Hide Answer
                                        </button>
                                        <button
                                            onClick={nextCard}
                                            disabled={currentCard === cards.length - 1}
                                            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                                        >
                                            Next Card
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            onClick={prevCard}
                            disabled={currentCard === 0}
                            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </button>
                        
                        <button
                            onClick={() => setStudyMode(false)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Exit Study Mode
                        </button>
                        
                        <button
                            onClick={nextCard}
                            disabled={currentCard === cards.length - 1}
                            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Flashcards Creator
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Create interactive flashcards for effective learning
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter flashcard set title"
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
                                Topic
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Specific topic"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
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
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <button
                            onClick={addCard}
                            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Card
                        </button>
                        
                        <button
                            onClick={generateAIFlashcards}
                            disabled={isGenerating || !title.trim() || !subject}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-secondary-600 to-primary-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4 mr-2" />
                            )}
                            Generate AI Cards
                        </button>
                        
                        <button
                            onClick={startStudyMode}
                            disabled={cards.length === 0}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            <Play className="w-4 h-4 mr-2" />
                            Study Mode
                        </button>
                    </div>

                    <button
                        onClick={generateFlashcards}
                        disabled={isGenerating || !title.trim() || !subject || cards.length === 0}
                        className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                                Creating Flashcards...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 inline mr-2" />
                                Create Flashcard Set
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

                {cards.map((card, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Card {index + 1}
                            </h3>
                            <button
                                onClick={() => removeCard(index)}
                                className="p-2 text-red-600 hover:text-red-700 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Front (Question)
                                </label>
                                <textarea
                                    value={card.front}
                                    onChange={(e) => updateCard(index, 'front', e.target.value)}
                                    placeholder="Enter the question or prompt"
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Back (Answer)
                                </label>
                                <textarea
                                    value={card.back}
                                    onChange={(e) => updateCard(index, 'back', e.target.value)}
                                    placeholder="Enter the answer or explanation"
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Hint (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={card.hint}
                                    onChange={(e) => updateCard(index, 'hint', e.target.value)}
                                    placeholder="Optional hint for this card"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Difficulty
                                </label>
                                <select
                                    value={card.difficulty}
                                    onChange={(e) => updateCard(index, 'difficulty', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Flashcards;
