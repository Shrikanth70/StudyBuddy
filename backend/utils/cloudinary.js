const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
    api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'your-api-secret'
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'studybuddy-avatars',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [
            { width: 300, height: 300, crop: 'fill', gravity: 'face' }
        ]
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Upload avatar function
const uploadAvatar = async (base64String) => {
    try {
        const result = await cloudinary.uploader.upload(base64String, {
            folder: 'studybuddy-avatars',
            width: 300,
            height: 300,
            crop: 'fill',
            gravity: 'face'
        });
        return result.secure_url;
    } catch (error) {
        throw new Error('Failed to upload avatar');
    }
};

// Delete avatar function
const deleteAvatar = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error('Failed to delete avatar');
    }
};

// Extract public ID from URL
const extractPublicId = (url) => {
    const parts = url.split('/');
    const publicId = parts[parts.length - 1].split('.')[0];
    return `studybuddy-avatars/${publicId}`;
};

module.exports = {
    upload,
    uploadAvatar,
    deleteAvatar,
    extractPublicId
};
