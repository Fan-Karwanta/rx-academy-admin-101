import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, UserX, Search, Edit, Shield, ShieldOff, Heart, Eye } from 'lucide-react';
import { API_BASE_URL } from '../config';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    blocked: 0
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchQuery, verifiedFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchQuery && { q: searchQuery }),
        ...(verifiedFilter && { verified: verifiedFilter }),
      });

      const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.pagination.pages);
        
        // Calculate stats
        setStats({
          total: data.pagination.total,
          verified: data.users.filter(u => u.isVerified).length,
          blocked: data.users.filter(u => u.status === 'blocked').length
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId, verify) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVerified: verify }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleBlockUser = async (userId, block) => {
    try {
      const endpoint = block ? 'block' : 'unblock';
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/${endpoint}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const fetchSavedDestinations = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/saved-destinations`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        return data.savedDestinations;
      }
    } catch (error) {
      console.error('Error fetching saved destinations:', error);
    }
    return [];
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const UserModal = ({ isOpen, onClose, user }) => {
    const [savedDestinations, setSavedDestinations] = useState([]);
    const [loadingSaved, setLoadingSaved] = useState(false);

    useEffect(() => {
      if (user && isOpen) {
        setLoadingSaved(true);
        fetchSavedDestinations(user._id).then(destinations => {
          setSavedDestinations(destinations);
          setLoadingSaved(false);
        });
      }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">User Details</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-800 rounded-full overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Users className="h-8 w-8 text-gray-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                    <p className="text-gray-400">{user.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white">{user.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">{user.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Verified:</span>
                    <span className={`${user.isVerified ? 'text-green-500' : 'text-red-500'}`}>
                      {user.isVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since:</span>
                    <span className="text-white">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Statistics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Trips Completed:</span>
                    <span className="text-white">{user.tripsCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Favorite Destinations:</span>
                    <span className="text-white">{user.favoriteDestinations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Distance:</span>
                    <span className="text-white">{user.totalDistance}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Saved Destinations */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Saved Destinations</h4>
              {loadingSaved ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : savedDestinations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedDestinations.map((saved) => (
                    <div key={saved._id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg overflow-hidden">
                          {saved.destinationId?.photos?.main && (
                            <img
                              src={saved.destinationId.photos.main}
                              alt={saved.destinationId.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{saved.destinationId?.name}</p>
                          <p className="text-sm text-gray-400">{saved.destinationId?.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No saved destinations</p>
              )}
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1">Manage registered users and their profiles</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={Users}
        />
        <StatCard
          title="Verified Users"
          value={stats.verified}
          icon={UserCheck}
        />
        <StatCard
          title="Blocked Users"
          value={stats.blocked}
          icon={UserX}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
          />
        </div>
        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
        >
          <option value="">All Users</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                          {user.profileImage ? (
                            <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Users className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-400">{user.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{user.email}</div>
                      <div className="text-sm text-gray-400">{user.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                        {user.status === 'blocked' && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Blocked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleVerifyUser(user._id, !user.isVerified)}
                          className={`${user.isVerified ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                        >
                          {user.isVerified ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleBlockUser(user._id, user.status !== 'blocked')}
                          className={`${user.status === 'blocked' ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
                        >
                          {user.status === 'blocked' ? <Shield className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page
                  ? 'bg-white text-black'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* User Detail Modal */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersPage;
