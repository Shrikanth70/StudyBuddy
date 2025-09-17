import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Send, Image, Paperclip, Smile, MoreHorizontal,
  Phone, Video as VideoIcon, User, Calendar, Clock, Hash,
  Users, Crown, Settings, Download, Bell, FileText, Trash2,
  Mic, MicOff, X, CheckCircle, MessageCircle
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GroupChannelDetail = ({ type, data, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  // Sample messages for demonstration
  const sampleMessages = [
    {
      id: 1,
      sender: { name: "Alice", _id: "user1" },
      text: "Hey everyone! Ready to study?",
      timestamp: new Date(Date.now() - 3600000),
      type: "text"
    },
    {
      id: 2,
      sender: { name: "Bob", _id: "user2" },
      text: "Yes! I've been reviewing the material",
      timestamp: new Date(Date.now() - 3500000),
      type: "text"
    },
    {
      id: 3,
      sender: { name: "AI Assistant", _id: "ai" },
      text: "Welcome to the study session! I can help answer questions.",
      timestamp: new Date(Date.now() - 3400000),
      type: "text"
    },
    {
      id: 4,
      sender: { name: "Alice", _id: "user1" },
      text: "Can someone explain neural networks?",
      timestamp: new Date(Date.now() - 3300000),
      type: "text"
    }
  ];

  useEffect(() => {
    setMessages(sampleMessages);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: user,
        text: newMessage,
        timestamp: new Date(),
        type: "text"
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isAdmin = () => {
    if (type === 'group') {
      return data.members?.some(m => m.user._id === user?._id && m.role === 'admin');
    }
    return data.owner?._id === user?._id;
  };

  const startVideoCall = () => {
    alert(`Starting ${type} video call for ${data.name}`);
  };

  const startVoiceCall = () => {
    alert(`Starting ${type} voice call for ${data.name}`);
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            {type === 'channel' && <Hash className="w-5 h-5 text-purple-600" />}
            {type === 'group' && <Users className="w-5 h-5 text-blue-600" />}
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {data.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {type === 'group' ? `${data.members?.length || 0} members` : `${data.members?.length || 0} subscribers`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={startVoiceCall}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button
            onClick={startVideoCall}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <VideoIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex space-x-3 ${
                  message.sender._id === user?._id ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender._id !== user?._id && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                    {message.sender.name.charAt(0)}
                  </div>
                )}
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender._id === user?._id
                      ? 'bg-blue-600 text-white'
                      : message.sender._id === 'ai'
                      ? 'bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Paperclip className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Image className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${type === 'group' ? 'group' : 'channel'}...`}
                className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="p-2 text-blue-600 hover:text-blue-700 disabled:text-gray-400"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar - Members/Settings */}
        {(showMembers || showSettings) && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {showMembers && (
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Members ({data.members?.length || 0})
                </h3>
                <div className="space-y-2">
                  {data.members?.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                          {member.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.user?.name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {member.role || 'member'}
                          </p>
                        </div>
                      </div>
                      {member.role === 'admin' && <Crown className="w-4 h-4 text-yellow-500" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showSettings && (
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {type === 'group' ? 'Group Settings' : 'Channel Settings'}
                </h3>
                <div className="space-y-3">
                  {isAdmin() && (
                    <>
                      <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <FileText className="w-5 h-5" />
                        <span>Manage {type === 'group' ? 'Group' : 'Channel'}</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <Users className="w-5 h-5" />
                        <span>Manage Members</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <Bell className="w-5 h-5" />
                        <span>Notification Settings</span>
                      </button>
                    </>
                  )}
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <Download className="w-5 h-5" />
                    <span>Download Resources</span>
                  </button>
                  {data.isDummy && (
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400">
                      <Trash2 className="w-5 h-5" />
                      <span>Delete {type}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChannelDetail;
