import React, { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';

const DocumentUpload = ({ onClose, onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const { user } = useAuth();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'text/plain', 'text/markdown'];
      return validTypes.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.md');
    });

    if (validFiles.length === 0) {
      setError('Please select PDF, TXT, or MD files only.');
      return;
    }

    if (validFiles.length > 1) {
      setError('Please upload one file at a time.');
      return;
    }

    uploadFile(validFiles[0]);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setError('');
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadStatus({
          type: 'success',
          message: `Successfully processed ${file.name} with ${response.data.chunkCount} chunks.`,
          fileName: file.name
        });
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'application/pdf':
        return '📄';
      case 'text/plain':
      case 'text/markdown':
        return '📝';
      default:
        return '📄';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Upload Study Document</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Processing document...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drop your document here
                </p>
                <p className="text-gray-600 mb-4">
                  or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    browse files
                  </button>
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF, TXT, and MD files
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md"
            onChange={handleFileSelect}
            className="hidden"
          />

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {uploadStatus && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-green-700 text-sm font-medium">{uploadStatus.message}</p>
                <p className="text-green-600 text-xs mt-1">
                  {uploadStatus.fileName} is now available for AI queries
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
