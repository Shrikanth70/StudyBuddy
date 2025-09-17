import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send, Bot, User, Paperclip, Users, Hash,
  ChevronDown, ChevronRight, Plus, Upload, FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { studyGroupsAPI, channelsAPI, api } from '../utils/api';
import CreateStudyGroup from './CreateStudyGroup';
import CreateChannel from './CreateChannel';
import DocumentUpload from './DocumentUpload';
import '../styles/ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    ai: true,
    groups: true,
    channels: true
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState(null);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  // Chat list state
  const [chats, setChats] = useState({
    ai: [
      {
        id: 'ai-chat',
        name: 'StudyBuddy AI',
        type: 'ai',
        lastMessage: 'Hello! How can I help you study today?',
        unread: 0,
        timestamp: new Date(),
        avatar: <Bot className="chat-avatar-icon" />
      }
    ],
    groups: [],
    channels: []
  });

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch chat history when AI chat selected
  useEffect(() => {
    if (currentUser?._id && selectedChat?.type === 'ai') {
      fetchChatHistory();
    }
  }, [currentUser, selectedChat]);

  // Fetch groups and channels
  useEffect(() => {
    if (currentUser?._id) {
      fetchStudyGroups();
      fetchChannels();
    }
  }, [currentUser]);

  const fetchChatHistory = async () => {
    try {
      const response = await api.get(`/chat/history/${currentUser._id}`);
      if (response.data.messages?.length > 0) {
        setMessages(
          response.data.messages.map(msg => ({
            id: msg._id,
            sender: msg.sender,
            message: msg.message,
            timestamp: new Date(msg.timestamp),
            type: msg.messageType || 'text'
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!currentUser) {
      setShowLoginPrompt(true);
      return;
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      message: inputMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await api.post('/chat/send', {
        userId: currentUser._id,
        message: userMessage.message
      });

      if (response.data.aiMessage) {
        const aiMessage = {
          id: response.data.aiMessage._id,
          sender: 'ai',
          message: response.data.aiMessage.message,
          timestamp: new Date(response.data.aiMessage.timestamp),
          type: 'text'
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setMessages([]);
    if (chat.type === 'ai') {
      setMessages([{
        id: 'welcome',
        sender: 'ai',
        message: `Hello ${currentUser?.name || 'there'}! I'm your StudyBuddy AI. How can I help you with your studies today?`,
        timestamp: new Date(),
        type: 'text'
      }]);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fetchStudyGroups = async () => {
    try {
      const response = await studyGroupsAPI.getUserGroups();
      if (response.data.success) {
        const groups = response.data.groups.map(group => ({
          id: group._id,
          name: group.name,
          type: 'group',
          lastMessage: group.lastMessage || 'No messages yet',
          unread: group.unreadCount || 0,
          timestamp: new Date(group.updatedAt || group.createdAt),
          members: group.members?.length || 0,
          avatar: <Users className="chat-avatar-icon" />
        }));
        setChats(prev => ({ ...prev, groups }));
      }
    } catch (err) {
      console.error('Error fetching study groups:', err);
    }
  };

  const fetchChannels = async () => {
    try {
      const response = await channelsAPI.getAll();
      if (response.data.success) {
        const channels = response.data.channels.map(channel => ({
          id: channel._id,
          name: channel.name,
          type: 'channel',
          lastMessage: channel.lastMessage || 'No messages yet',
          unread: channel.unreadCount || 0,
          timestamp: new Date(channel.updatedAt || channel.createdAt),
          avatar: <Hash className="chat-avatar-icon" />
        }));
        setChats(prev => ({ ...prev, channels }));
      }
    } catch (err) {
      console.error('Error fetching channels:', err);
    }
  };

  const handleCreateGroup = () => {
    setCreateType('group');
    setShowCreateModal(true);
  };

  const handleCreateChannel = () => {
    setCreateType('channel');
    setShowCreateModal(true);
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setCreateType(null);
  };

  return (
    <div className="chat-interface">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header"><h3>Chats</h3></div>

        {/* AI Chat */}
        <div className="chat-section">
          <div className="section-header" onClick={() => toggleSection('ai')}>
            <div className="section-title"><Bot size={18} /><span>AI Chat</span></div>
            {expandedSections.ai ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>
          {expandedSections.ai && (
            <div className="section-content">
              {chats.ai.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="chat-avatar">{chat.avatar}</div>
                  <div className="chat-info">
                    <div className="chat-name">{chat.name}</div>
                    <div className="chat-last-message">{chat.lastMessage}</div>
                  </div>
                  <div className="chat-meta">
                    <div className="chat-time">{formatTime(chat.timestamp)}</div>
                    {chat.unread > 0 && <div className="unread-badge">{chat.unread}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Study Groups */}
        <div className="chat-section">
          <div className="section-header">
            <div className="section-title" onClick={() => toggleSection('groups')} style={{ cursor: 'pointer' }}>
              <Users size={18} /><span>Study Groups</span>
            </div>
            <div className="section-actions">
              <button className="create-btn" onClick={handleCreateGroup} title="Create new study group">
                <Plus size={16} />
              </button>
              {expandedSections.groups ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </div>
          {expandedSections.groups && (
            <div className="section-content">
              {chats.groups.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="chat-avatar">{chat.avatar}</div>
                  <div className="chat-info">
                    <div className="chat-name">{chat.name}</div>
                    <div className="chat-last-message">{chat.lastMessage}</div>
                  </div>
                  <div className="chat-meta">
                    <div className="chat-time">{formatTime(chat.timestamp)}</div>
                    {chat.unread > 0 && <div className="unread-badge">{chat.unread}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Channels */}
        <div className="chat-section">
          <div className="section-header">
            <div className="section-title" onClick={() => toggleSection('channels')} style={{ cursor: 'pointer' }}>
              <Hash size={18} /><span>Channels</span>
            </div>
            <div className="section-actions">
              <button className="create-btn" onClick={handleCreateChannel} title="Create new channel">
                <Plus size={16} />
              </button>
              {expandedSections.channels ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          </div>
          {expandedSections.channels && (
            <div className="section-content">
              {chats.channels.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="chat-avatar">{chat.avatar}</div>
                  <div className="chat-info">
                    <div className="chat-name">{chat.name}</div>
                    <div className="chat-last-message">{chat.lastMessage}</div>
                  </div>
                  <div className="chat-meta">
                    <div className="chat-time">{formatTime(chat.timestamp)}</div>
                    {chat.unread > 0 && <div className="unread-badge">{chat.unread}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <div className="header-content">
                <div className="header-icon">{selectedChat.avatar}</div>
                <div className="header-text">
                  <h3>{selectedChat.name}</h3>
                  {selectedChat.type === 'group' && <p>{selectedChat.members} members</p>}
                </div>
              </div>
            </div>

            <div className="messages-container">
              <div className="messages-list">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                  >
                    <div className="message-avatar">
                      {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{message.message}</div>
                      <div className="message-time">{formatTime(message.timestamp)}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {selectedChat.type === 'ai' && (
              <div className="input-container">
                <div className="input-wrapper">
                  <button
                    className="attachment-btn"
                    onClick={() => setShowDocumentUpload(true)}
                    title="Upload study documents"
                  >
                    <Upload size={20} />
                  </button>
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question here..."
                    disabled={isLoading}
                    rows={1}
                  />
                  <button
                    className="send-btn"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    {isLoading ? <div className="loading-spinner"></div> : <Send size={20} />}
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="no-chat-selected">
            <Bot size={64} className="no-chat-icon" />
            <h2>Select a chat to start</h2>
            <p>Choose from AI chat, study groups, or channels to begin your conversation.</p>
          </div>
        )}
      </div>

      {/* Login Prompt */}
      {showLoginPrompt && (
        <div className="login-prompt">
          <div className="login-content">
            <h3>Login Required</h3>
            <p>Please log in to start chatting with StudyBuddy AI.</p>
            <div className="login-actions">
              <button onClick={() => setShowLoginPrompt(false)}>Cancel</button>
              <button onClick={() => navigate('/login')}>Login</button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="error-toast">
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* Create Modals */}
      {showCreateModal && createType === 'group' && (
        <CreateStudyGroup
          onCancel={handleCancelCreate}
          onClose={() => setShowCreateModal(false)}
          onGroupCreated={fetchStudyGroups}
        />
      )}
      {showCreateModal && createType === 'channel' && (
        <CreateChannel
          onClose={() => setShowCreateModal(false)}
          onChannelCreated={fetchChannels}
        />
      )}

      {/* Document Upload Modal */}
      {showDocumentUpload && (
        <DocumentUpload
          onClose={() => setShowDocumentUpload(false)}
          onUploadSuccess={() => {
            setShowDocumentUpload(false);
            // Optionally refresh chat or show success message
          }}
        />
      )}
    </div>
  );
};

export default ChatInterface;
