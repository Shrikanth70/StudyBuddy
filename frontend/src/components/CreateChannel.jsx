import React, { useState } from "react";
import { X, Hash, Lock } from "lucide-react";
import { channelsAPI } from "../utils/api";

const CreateChannel = ({ onChannelCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await channelsAPI.create(formData);
      onChannelCreated(response.data.channel);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-hidden border border-white/20 dark:border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Create Channel</h2>
              <p className="text-blue-100 mt-1">Create a new communication channel</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto max-h-[calc(95vh-150px)]">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Hash className="w-5 h-5 mr-2 text-blue-500" />
                Channel Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white transition-all"
                placeholder="General Discussion"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Hash className="w-5 h-5 mr-2 text-purple-500" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                maxLength={300}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white transition-all resize-none"
                placeholder="Describe the purpose of this channel..."
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleChange}
                className="w-5 h-5 text-red-500 rounded focus:ring-red-500"
              />
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                <Lock className="w-5 h-5 mr-2 text-red-500" />
                Private Channel
              </label>
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannel;
