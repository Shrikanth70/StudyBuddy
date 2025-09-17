import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const ProfileImageUpload = () => {
    const { user, updateUser } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [removing, setRemoving] = useState(false);

    // Get avatar URL
    const getAvatarUrl = (avatar) => {
        if (!avatar) return '';
        if (avatar.startsWith('/uploads')) {
            return `http://localhost:5000${avatar}`;
        }
        return avatar;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', selectedFile);

            const response = await axios.put('http://localhost:5000/api/auth/profile', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                updateUser(response.data.user);
                alert('Profile image updated successfully!');
                setSelectedFile(null);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = async () => {
        if (!user?.avatar || user.avatar.includes('ui-avatars.com')) {
            alert('No custom avatar to remove');
            return;
        }

        setRemoving(true);
        try {
            const response = await axios.delete('http://localhost:5000/api/auth/profile/avatar', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                updateUser(response.data.user);
                alert('Profile image removed successfully!');
            }
        } catch (error) {
            console.error('Remove error:', error);
            alert('Failed to remove image: ' + (error.response?.data?.message || error.message));
        } finally {
            setRemoving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <img
                    src={selectedFile ? URL.createObjectURL(selectedFile) : getAvatarUrl(user?.avatar)}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-primary-200"
                />
                <div className="flex flex-col space-y-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="profile-upload"
                    />
                    <label
                        htmlFor="profile-upload"
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-center"
                    >
                        Choose Image
                    </label>
                    {user?.avatar && !user.avatar.includes('ui-avatars.com') && (
                        <button
                            onClick={handleRemove}
                            disabled={removing}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                            {removing ? 'Removing...' : 'Remove Avatar'}
                        </button>
                    )}
                </div>
            </div>
            {selectedFile && (
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                    {uploading ? 'Uploading...' : 'Upload'}
                </button>
            )}
        </div>
    );
};

export default ProfileImageUpload;
