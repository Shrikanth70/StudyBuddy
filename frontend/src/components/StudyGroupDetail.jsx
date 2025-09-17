import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const StudyGroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [newResource, setNewResource] = useState({ title: "", url: "", type: "article" });

  useEffect(() => {
    fetchGroupDetails();
    fetchMessages();
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/study-groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroup(response.data.group);
    } catch (err) {
      setError("Failed to load group details");
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/group-chat/${id}/messages`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages(response.data.messages);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/study-groups/${id}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchGroupDetails();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to join group");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/group-chat/${id}/messages`,
        { message: newMessage },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessages([...messages, response.data.message]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/study-groups/${id}/resources`,
        newResource,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewResource({ title: "", url: "", type: "article" });
      fetchGroupDetails();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add resource");
    }
  };

  const isMember = group?.members?.some(member => member.user._id === localStorage.getItem("userId"));

  if (loading) {
    return <div className="text-center mt-10">Loading group...</div>;
  }

  if (!group) {
    return <div className="text-center mt-10 text-red-600">Group not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/study-groups")}
        className="mb-4 text-blue-600 hover:text-blue-800"
      >
        ← Back to Groups
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
            <p className="text-gray-600 mb-2">{group.description}</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {group.subject}
              </span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                {group.difficulty}
              </span>
              {group.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          {!isMember && (
            <button
              onClick={handleJoinGroup}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Join Group
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>{group.members.length} members</span>
          <span>•</span>
          <span>Max {group.maxMembers} members</span>
          <span>•</span>
          <span>{group.isPrivate ? "Private" : "Public"}</span>
        </div>
      </div>

      {isMember && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border-b p-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveTab("chat")}
                    className={`px-4 py-2 rounded ${activeTab === "chat" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => setActiveTab("resources")}
                    className={`px-4 py-2 rounded ${activeTab === "resources" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                  >
                    Resources
                  </button>
                  <button
                    onClick={() => setActiveTab("members")}
                    className={`px-4 py-2 rounded ${activeTab === "members" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                  >
                    Members
                  </button>
                </div>
              </div>

              <div className="p-4">
                {activeTab === "chat" && (
                  <div>
                    <div className="h-96 overflow-y-auto mb-4 border rounded p-2">
                      {messages.map(message => (
                        <div key={message._id} className="mb-3">
                          <div className="flex items-start space-x-2">
                            <img
                              src={message.sender.profileImage || "/default-avatar.png"}
                              alt={message.sender.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <div className="font-semibold text-sm">{message.sender.name}</div>
                              <div className="text-gray-700">{message.message}</div>
                              <div className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === "resources" && (
                  <div>
                    <form onSubmit={handleAddResource} className="mb-4 space-y-2">
                      <input
                        type="text"
                        placeholder="Resource title"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                      <input
                        type="url"
                        placeholder="Resource URL"
                        value={newResource.url}
                        onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                      <select
                        value={newResource.type}
                        onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                        <option value="document">Document</option>
                        <option value="quiz">Quiz</option>
                        <option value="other">Other</option>
                      </select>
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Add Resource
                      </button>
                    </form>

                    <div className="space-y-2">
                      {group.resources.map(resource => (
                        <div key={resource._id} className="border rounded p-3">
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {resource.title}
                          </a>
                          <div className="text-sm text-gray-600">
                            {resource.type} • Added by {resource.addedBy?.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "members" && (
                  <div>
                    {group.members.map(member => (
                      <div key={member.user._id} className="flex items-center space-x-3 mb-3">
                        <img
                          src={member.user.profileImage || "/default-avatar.png"}
                          alt={member.user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold">{member.user.name}</div>
                          <div className="text-sm text-gray-600">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-bold mb-3">Group Rules</h3>
              {group.rules.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {group.rules.map((rule, index) => (
                    <li key={index} className="text-sm">{rule}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-600">No rules specified</p>
              )}
            </div>
          </div>
        </div>
      )}

      {!isMember && (
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-lg mb-4">Join this group to participate in discussions and access resources!</p>
          <button
            onClick={handleJoinGroup}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Join Study Group
          </button>
        </div>
      )}
    </div>
  );
};

export default StudyGroupDetail;
