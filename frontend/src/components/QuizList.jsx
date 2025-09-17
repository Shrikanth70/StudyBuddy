import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Target, Users, Trash2, Edit3, Play, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const QuizList = () => {
    const { user } = useAuth();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/quizzes', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setQuizzes(data.quizzes || []);
            } else {
                throw new Error('Failed to fetch quizzes');
            }
        } catch (err) {
            setError('Failed to load quizzes. Please try again.');
            console.error('Error fetching quizzes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (quizId) => {
        if (!window.confirm('Are you sure you want to delete this quiz?')) return;

        try {
            setDeletingId(quizId);
            const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
            } else {
                throw new Error('Failed to delete quiz');
            }
        } catch (err) {
            setError('Failed to delete quiz. Please try again.');
            console.error('Error deleting quiz:', err);
        } finally {
            setDeletingId(null);
        }
    };

    const handleStartQuiz = (quiz) => {
        // Navigate to quiz taking page or open modal
        alert(`Starting quiz: ${quiz.title}`);
    };

    const getDifficultyColor = (difficulty) => {
        const colors = {
            easy: 'text-green-600 bg-green-100',
            medium: 'text-yellow-600 bg-yellow-100',
            hard: 'text-red-600 bg-red-100'
        };
        return colors[difficulty] || 'text-gray-600 bg-gray-100';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                    onClick={fetchQuizzes}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (quizzes.length === 0) {
        return (
            <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No quizzes yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first quiz to get started with studying!
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
                <div key={quiz._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {quiz.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                            {quiz.difficulty}
                        </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {quiz.description || 'No description provided'}
                    </p>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <BookOpen className="w-4 h-4 mr-2" />
                            <span>{quiz.subject}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Target className="w-4 h-4 mr-2" />
                            <span>{quiz.questions?.length || 0} questions</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{new Date(quiz.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleStartQuiz(quiz)}
                            className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                        >
                            <Play className="w-4 h-4 inline mr-1" />
                            Start
                        </button>
                        <button
                            onClick={() => alert('Edit functionality coming soon')}
                            className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => handleDelete(quiz._id)}
                            disabled={deletingId === quiz._id}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm disabled:opacity-50"
                        >
                            {deletingId === quiz._id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Trash2 className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default QuizList;
