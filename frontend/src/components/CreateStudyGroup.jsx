import React, { useState } from "react";
import { X, Users, Book, Hash, Lock, Tag, ListChecks, Sparkles, ChevronRight } from "lucide-react";
import { studyGroupsAPI } from "../utils/api";

const CreateStudyGroup = ({ onGroupCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
    difficulty: "all-levels",
    maxMembers: 50,
    isPrivate: false,
    tags: "",
    rules: "",
    settings: {
      allowFileSharing: true,
      allowVoiceChat: false,
      requireApproval: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("basic");

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
      const response = await studyGroupsAPI.create({
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        rules: formData.rules.split("\n").filter(rule => rule.trim())
      });

      onGroupCreated(response.data.group);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create study group");
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "basic", title: "Basic Info", icon: Book },
    { id: "details", title: "Details", icon: Users },
    { id: "settings", title: "Settings", icon: Sparkles }
  ];

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-hidden border border-white/20 dark:border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Create Study Group</h2>
              <p className="text-blue-100 mt-1">Build your perfect learning community</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800/50">
          {sections.map((section, index) => (
            <div key={section.id} className="flex items-center">
              <button
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.title}</span>
              </button>
              {index < sections.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto max-h-[calc(95vh-200px)]">
          {/* Basic Info Section */}
          {activeSection === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Book className="w-5 h-5 mr-2 text-blue-500" />
                    Group Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white transition-all"
                    placeholder="Advanced React Study Group"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Book className="w-5 h-5 mr-2 text-purple-500" />
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white transition-all"
                    placeholder="React, JavaScript, Mathematics"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Users className="w-5 h-5 mr-2 text-pink-500" />
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white transition-all resize-none"
                  placeholder="Describe what this study group is about..."
                />
              </div>
            </div>
          )}

          {/* Details Section */}
          {activeSection === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Users className="w-5 h-5 mr-2 text-green-500" />
                    Max Members
                  </label>
                  <input
                    type="number"
                    name="maxMembers"
                    value={formData.maxMembers}
                    onChange={handleChange}
                    min="2"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Hash className="w-5 h-5 mr-2 text-orange-500" />
                    Difficulty Level
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white transition-all"
                  >
                    <option value="all-levels">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
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
                    Private Group
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Tag className="w-5 h-5 mr-2 text-indigo-500" />
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white transition-all"
                    placeholder="react, javascript, web-development"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Settings Section */}
          {activeSection === 'settings' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                  Group Settings
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div>
                      <label className="font-medium text-gray-900 dark:text-white">File Sharing</label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Allow members to share files</p>
                    </div>
                    <input
                      type="checkbox"
                      name="settings.allowFileSharing"
                      checked={formData.settings.allowFileSharing}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, allowFileSharing: e.target.checked }
                      }))}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div>
                      <label className="font-medium text-gray-900 dark:text-white">Voice Chat</label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Enable voice chat for meetings</p>
                    </div>
                    <input
                      type="checkbox"
                      name="settings.allowVoiceChat"
                      checked={formData.settings.allowVoiceChat}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, allowVoiceChat: e.target.checked }
                      }))}
                      className="w-5 h-5 text-purple-500 rounded focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div>
                      <label className="font-medium text-gray-900 dark:text-white">Require Approval</label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Approve new members manually</p>
                    </div>
                    <input
                      type="checkbox"
                      name="settings.requireApproval"
                      checked={formData.settings.requireApproval}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, requireApproval: e.target.checked }
                      }))}
                      className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <ListChecks className="w-5 h-5 mr-2 text-teal-500" />
                    Group Rules
                  </label>
                  <textarea
                    name="rules"
                    value={formData.rules}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-white transition-all resize-none"
                    placeholder="Be respectful&#10;Stay on topic&#10;Help others when possible"
                  />
                </div>
              </div>
            </div>
          )}

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
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudyGroup;
