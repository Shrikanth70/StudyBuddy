import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAvatarUrl } from '../utils/imageHelpers';
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    Edit3, 
    Save, 
    X, 
    Camera, 
    Lock, 
    Eye, 
    EyeOff,
    GraduationCap,
    Calendar,
    BookOpen,
    Trophy,
    Settings,
    Shield,
    Loader2
} from 'lucide-react';

const ProfilePage = () => {
    const { user, updateProfile, changePassword, loading: authLoading } = useAuth();
    
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        avatar: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Load user data when component mounts
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                avatar: user.avatar || getAvatarUrl(null)
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear errors
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear errors
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validatePasswordChange = () => {
        const newErrors = {};
        
        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }
        
        if (!passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        setSuccessMessage('');
        
        try {
            const result = await updateProfile({
                name: profileData.name,
                phone: profileData.phone,
                location: profileData.location,
                bio: profileData.bio,
                avatar: profileData.avatar
            });
            
            if (result.success) {
                setSuccessMessage(result.message || 'Profile updated successfully');
                setIsEditing(false);
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrors({ general: result.error });
            }
        } catch (error) {
            setErrors({ general: 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!validatePasswordChange()) return;
        
        setIsLoading(true);
        setSuccessMessage('');
        
        try {
            const result = await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            
            if (result.success) {
                setSuccessMessage(result.message || 'Password changed successfully');
                setIsChangingPassword(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setErrors({ general: result.error });
            }
        } catch (error) {
            setErrors({ general: 'Failed to change password' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ general: 'Image size should be less than 2MB' });
                return;
            }

            // Create a compressed version
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set max dimensions
                    const maxWidth = 200;
                    const maxHeight = 200;
                    let { width, height } = img;
                    
                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert to compressed JPEG
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    
                    setProfileData(prev => ({
                        ...prev,
                        avatar: compressedDataUrl
                    }));
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Please log in to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-green-700 dark:text-green-400">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {errors.general && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-700 dark:text-red-400">{errors.general}</p>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Profile Settings
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Manage your account and track your learning progress
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Profile Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Personal Information
                                </h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    disabled={isLoading}
                                    className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                                >
                                    {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Avatar Section */}
                                <div className="md:col-span-2 flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        <img
                                            src={profileData.avatar}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-full border-4 border-primary-200 dark:border-primary-700"
                                        />
                                        {isEditing && (
                                            <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                                                <Camera className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {profileData.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">{profileData.email}</p>
                                    </div>
                                </div>

                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    ) : (
                                        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-900 dark:text-gray-100">{profileData.name}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900 dark:text-gray-100">{profileData.email}</span>
                                    </div>
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    ) : (
                                        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-900 dark:text-gray-100">{profileData.phone || 'Not provided'}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Location Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Location
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location"
                                            value={profileData.location}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        />
                                    ) : (
                                        <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <MapPin className="w-5 h-5 text-gray-400" />
                                            <span className="text-gray-900 dark:text-gray-100">{profileData.location || 'Not provided'}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Bio Field */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Bio
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleProfileChange}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <p className="text-gray-900 dark:text-gray-100">{profileData.bio || 'No bio provided'}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Save Button */}
                                {isEditing && (
                                    <div className="md:col-span-2">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={isLoading}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                                            ) : (
                                                <Save className="w-5 h-5 inline mr-2" />
                                            )}
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Change Password Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Security Settings
                                </h2>
                                <button
                                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                                    disabled={isLoading}
                                    className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors disabled:opacity-50"
                                >
                                    <Lock className="w-4 h-4" />
                                    <span>{isChangingPassword ? 'Cancel' : 'Change Password'}</span>
                                </button>
                            </div>

                            {isChangingPassword ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                placeholder="Enter current password"
                                            />
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.currentPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                placeholder="Enter new password"
                                            />
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.newPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                                placeholder="Confirm new password"
                                            />
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleChangePassword}
                                        disabled={isLoading}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-secondary-600 to-primary-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                                        ) : (
                                            <Shield className="w-5 h-5 inline mr-2" />
                                        )}
                                        Update Password
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Keep your account secure by regularly updating your password
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Stats & Quick Actions */}
                    <div className="space-y-6">
                        {/* Learning Progress */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Learning Progress
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <BookOpen className="w-5 h-5 text-primary-600" />
                                        <span className="text-gray-600 dark:text-gray-400">Study Notes</span>
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {user?.progress?.notesCount || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <GraduationCap className="w-5 h-5 text-secondary-600" />
                                        <span className="text-gray-600 dark:text-gray-400">Quizzes Taken</span>
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {user?.progress?.quizzesTaken || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Trophy className="w-5 h-5 text-accent-600" />
                                        <span className="text-gray-600 dark:text-gray-400">Flashcards</span>
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {user?.progress?.flashcardsCount || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                        <span className="text-gray-600 dark:text-gray-400">Study Streak</span>
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {user?.progress?.studyStreak || 0} days
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Weekly Goal Progress
                                    </span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {user?.progress?.weeklyProgress || 0}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-primary-600 to-secondary-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${user?.progress?.weeklyProgress || 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        {/* Account Stats */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Account Stats
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Loading...'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Last Login</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Loading...'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Role</span>
                                    <span className="font-semibold text-gray-900 dark:text-white capitalize">
                                        {user?.role || 'Student'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    <Settings className="w-5 h-5 text-primary-600" />
                                    <span>Account Settings</span>
                                </button>
                                <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    <Shield className="w-5 h-5 text-secondary-600" />
                                    <span>Privacy & Security</span>
                                </button>
                                <button className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                    <BookOpen className="w-5 h-5 text-accent-600" />
                                    <span>Learning History</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
