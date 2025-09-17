import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Users, Search, RefreshCw, 
  Video, Settings, Trash2, Crown, Download, Bell, 
  FileText
} from "lucide-react";
import CreateStudyGroup from "./CreateStudyGroup";
import CreateChannel from "./CreateChannel";
import { io } from "socket.io-client";
import { studyGroupsAPI, channelsAPI, cache } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import GroupChannelDetail from "./GroupChannelDetail";

const StudyGroupsPage = () => {
  const [activeView, setActiveView] = useState('groups');
  const [groups, setGroups] = useState([]);
  const [channels, setChannels] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const navigate = useNavigate();
  const socket = io();
  const { user } = useAuth();
  const { isDark } = useTheme();

  // Dummy data for demonstration (only show if no real data)
  const dummyGroups = [
    {
      _id: 'demo-group-1',
      name: 'AI Study Group',
      description: 'Exploring artificial intelligence concepts and applications',
      subject: 'Computer Science',
      createdBy: { _id: 'demo-user' },
      isPrivate: false,
      createdAt: new Date(),
      members: [{ user: { _id: 'demo-user' }, role: 'admin' }],
      isDummy: true
    },
    {
      _id: 'demo-group-2',
      name: 'Math Study Circle',
      description: 'Advanced calculus and linear algebra discussions',
      subject: 'Mathematics',
      createdBy: { _id: 'demo-user' },
      isPrivate: true,
      createdAt: new Date(Date.now() - 86400000),
      members: [{ user: { _id: 'demo-user' }, role: 'member' }],
      isDummy: true
    }
  ];

  const dummyChannels = [
    {
      _id: 'demo-channel-1',
      name: 'Web Development',
      description: 'Frontend and backend development discussions',
      owner: { _id: 'demo-user', name: 'Demo Owner' },
      members: Array(15).fill({}),
      createdAt: new Date(),
      isDummy: true
    },
    {
      _id: 'demo-channel-2',
      name: 'Data Science',
      description: 'Machine learning and data analysis resources',
      owner: { _id: 'other-user', name: 'Other User' },
      members: Array(9).fill({}),
      createdAt: new Date(Date.now() - 172800000),
      isDummy: true
    }
  ];

  const fetchData = useCallback(async (forceRefresh = false) => {
    try {
      setRefreshing(true);
      setError("");

      const cacheKey = 'study_groups_data';
      const cachedData = cache.get(cacheKey);
      
      if (cachedData && !forceRefresh) {
        setGroups(cachedData.allGroups && cachedData.allGroups.length > 0 ? cachedData.allGroups : dummyGroups);
        setChannels(cachedData.allChannels && cachedData.allChannels.length > 0 ? cachedData.allChannels : dummyChannels);
        setMyGroups(cachedData.userGroups || []);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const apiCalls = [
        studyGroupsAPI.getAll({
          page: 1,
          limit: 20,
          search: searchTerm || undefined
        }),
        channelsAPI.getAll({
          page: 1,
          limit: 20,
          search: searchTerm || undefined
        })
      ];

      if (user) {
        apiCalls.push(studyGroupsAPI.getUserGroups());
      }

      const responses = await Promise.allSettled(apiCalls);

      const allGroupsResponse = responses[0];
      const allChannelsResponse = responses[1];
      
      let fetchedGroups = [];
      let fetchedChannels = [];
      
      if (allGroupsResponse.status === 'fulfilled') {
        fetchedGroups = allGroupsResponse.value.data.groups || [];
        setGroups(fetchedGroups.length > 0 ? fetchedGroups : dummyGroups);
      } else {
        console.error('Failed to fetch all groups:', allGroupsResponse.reason);
        setError("⚠️ Failed to fetch study groups. Please try again later.");
        setGroups(dummyGroups);
      }

      if (allChannelsResponse.status === 'fulfilled') {
        fetchedChannels = allChannelsResponse.value.data.channels || [];
        setChannels(fetchedChannels.length > 0 ? fetchedChannels : dummyChannels);
      } else {
        console.error('Failed to fetch all channels:', allChannelsResponse.reason);
        setChannels(dummyChannels);
      }

      if (user && responses.length > 2) {
        const userGroupsResponse = responses[2];
        if (userGroupsResponse.status === 'fulfilled') {
          const userGroups = userGroupsResponse.value.data.groups || [];
          setMyGroups(userGroups);
          
          // Update cache with the actual fetched data
          cache.set(cacheKey, {
            allGroups: fetchedGroups,
            allChannels: fetchedChannels,
            userGroups: userGroups,
            timestamp: Date.now()
          });
        }
      } else {
        // Update cache with the actual fetched data
        cache.set(cacheKey, {
          allGroups: fetchedGroups,
          allChannels: fetchedChannels,
          userGroups: myGroups,
          timestamp: Date.now()
        });
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError("⚠️ Failed to load study groups. Please check your connection and try again.");
      setGroups(dummyGroups);
      setChannels(dummyChannels);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchTerm, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData, user]);

  const handleRefresh = () => {
    cache.clear('study_groups_data');
    fetchData(true);
  };

  const handleGroupCreated = (newGroup) => {
    setGroups([newGroup, ...groups]);
    setMyGroups([newGroup, ...myGroups]);
    setShowCreateModal(false);
  };

  const handleChannelCreated = (newChannel) => {
    setChannels([newChannel, ...channels]);
    setShowCreateModal(false);
  };

  const handleDeleteItem = (id, type) => {
    if (type === 'group') {
      setGroups(groups.filter(group => group._id !== id));
      setMyGroups(myGroups.filter(group => group._id !== id));
    } else if (type === 'channel') {
      setChannels(channels.filter(channel => channel._id !== id));
    }
  };

  const startVideoCall = (groupId) => {
    alert(`Starting video call for group ${groupId}`);
    // Implement actual video call functionality here
  };

  const getUserRole = (group) => {
    if (!user) return null;
    const member = group.members?.find(m => m.user._id === user._id);
    return member?.role;
  };

  const isGroupAdmin = (group) => {
    return getUserRole(group) === 'admin';
  };

  const isChannelOwner = (channel) => {
    return user && channel.owner._id === user._id;
  };

  const filteredGroups = groups.filter((group) => {
    return (
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredChannels = channels.filter((channel) => {
    return (
      channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-gray-100'} px-4 py-8`}>
      <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Groups</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Connect and learn together</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>Create {activeView === 'groups' ? 'Group' : 'Channel'}</span>
          </button>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveView('groups')}
          className={`px-6 py-2 rounded-lg transition-all duration-200 ${
            activeView === 'groups'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Groups
        </button>
        <button
          onClick={() => setActiveView('channels')}
          className={`px-6 py-2 rounded-lg transition-all duration-200 ${
            activeView === 'channels'
              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Channels
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={`Search ${activeView} by name or description...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="transition-all duration-300">
        {activeView === 'groups' ? (
          /* Groups Section */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGroups.map((group) => (
              <div
                key={group._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 group cursor-pointer"
                onClick={() => {
                  setSelectedItem(group);
                  setSelectedType('group');
                  navigate(`/study-groups/${group._id}/details`);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{group.subject}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{group.members?.length || 0}</span>
                    </div>
                    {isGroupAdmin(group) && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
                  {group.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created {new Date(group.createdAt).toLocaleDateString()}
                  </span>
                  {group.isPrivate && (
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">Private</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startVideoCall(group._id);
                    }}
                    className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                  >
                    <Video className="w-4 h-4" />
                    <span>Video Call</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/study-groups/${group._id}`);
                      }}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    
                    {group.isDummy && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(group._id, 'group');
                        }}
                        className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Channels Section */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredChannels.map((channel) => (
              <div
                key={channel._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 group cursor-pointer"
                onClick={() => {
                  setSelectedItem(channel);
                  setSelectedType('channel');
                  navigate(`/channels/${channel._id}/details`);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {channel.name}
                    </h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Channel</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{channel.members?.length || 0}</span>
                    </div>
                    {isChannelOwner(channel) && (
                      <Crown className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
                  {channel.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Owner: {channel.owner?.name || 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created {new Date(channel.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isChannelOwner(channel) ? (
                      <>
                        <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
                          <FileText className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                          <Bell className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                          <Bell className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {channel.isDummy && (
                    <button
                      onClick={() => handleDeleteItem(channel._id, 'channel')}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* No Items Found */}
      {(activeView === 'groups' ? filteredGroups.length === 0 : filteredChannels.length === 0) && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No {activeView} found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or create a new {activeView.slice(0, -1)}!
          </p>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full transition-all transform scale-95 hover:scale-100 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {activeView === 'groups' ? (
              <CreateStudyGroup onGroupCreated={handleGroupCreated} onCancel={() => setShowCreateModal(false)} />
            ) : (
              <CreateChannel onChannelCreated={handleChannelCreated} onCancel={() => setShowCreateModal(false)} />
            )}
          </div>
        </div>
      )}

      {/* Group/Channel Detail View */}
      {selectedItem && selectedType && (
        <GroupChannelDetail
          data={selectedItem}
          type={selectedType}
          onClose={() => {
            setSelectedItem(null);
            setSelectedType(null);
            navigate('/study-groups');
          }}
        />
      )}
      </div>
    </div>
  );
};

export default StudyGroupsPage;
