import React, { useState } from 'react';
import { FileText, Download, Copy, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NotesGenerator = () => {
    const { user } = useAuth();
    const [topic, setTopic] = useState('');
    const [subject, setSubject] = useState('');
    const [difficulty, setDifficulty] = useState('intermediate');
    const [generatedNotes, setGeneratedNotes] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const subjects = [
        'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
        'History', 'Geography', 'Literature', 'Economics', 'Business Studies',
        'Psychology', 'Sociology', 'Philosophy', 'Art', 'Music'
    ];

    const generateNotes = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic');
            return;
        }

        setIsGenerating(true);
        setError('');
        setSuccess('');

        try {
            // Simulate AI generation - in real app, this would call your AI service
            const mockNotes = `# ${topic}

## Overview
${topic} is a fundamental concept in ${subject || 'this subject'} that requires careful study and understanding.

## Key Concepts
- **Primary Definition**: ${topic} refers to...
- **Core Principles**: The main principles include...
- **Applications**: This concept is used in...

## Detailed Explanation
### Introduction
${topic} plays a crucial role in understanding ${subject || 'the subject matter'}. It encompasses various aspects that students need to master.

### Main Components
1. **Component 1**: Description of the first key component
2. **Component 2**: Description of the second key component
3. **Component 3**: Description of the third key component

### Examples and Applications
- **Real-world Example 1**: How this concept applies in practice
- **Real-world Example 2**: Another practical application
- **Problem-solving**: Step-by-step approach to solving related problems

## Summary
Understanding ${topic} is essential for advancing in ${subject || 'your studies'}. Regular practice and application of these concepts will lead to mastery.

## Study Tips
- Review the key concepts daily
- Practice with related problems
- Create flashcards for important terms
- Discuss with peers or teachers`;

            setGeneratedNotes(mockNotes);
            setSuccess('Notes generated successfully!');
        } catch (err) {
            setError('Failed to generate notes. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const saveNotes = async () => {
        if (!generatedNotes) return;

        try {
            const response = await fetch('http://localhost:5000/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: `Notes on ${topic}`,
                    content: generatedNotes,
                    subject: subject || 'General',
                    topic: topic,
                    type: 'note',
                    aiGenerated: true
                })
            });

            if (response.ok) {
                setSuccess('Notes saved to your library!');
            } else {
                setError('Failed to save notes');
            }
        } catch (err) {
            setError('Failed to save notes');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedNotes);
        setSuccess('Copied to clipboard!');
    };

    const downloadNotes = () => {
        const blob = new Blob([generatedNotes], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${topic}-notes.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        AI Notes Generator
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Generate comprehensive study notes on any topic with AI assistance
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Topic
                            </label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Enter topic (e.g., Photosynthesis, Linear Algebra)"
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
                                Difficulty Level
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

                    <button
                        onClick={generateNotes}
                        disabled={isGenerating || !topic.trim()}
                        className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                                Generating Notes...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 inline mr-2" />
                                Generate Notes
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

                {generatedNotes && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Generated Notes
                            </h2>
                            <div className="flex space-x-2">
                                <button
                                    onClick={copyToClipboard}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    title="Copy to clipboard"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={downloadNotes}
                                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    title="Download as markdown"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={saveNotes}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    <FileText className="w-4 h-4 inline mr-2" />
                                    Save to Library
                                </button>
                            </div>
                        </div>
                        
                        <div className="prose dark:prose-invert max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300">
                                {generatedNotes}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesGenerator;
