import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Clock, 
  Phone, 
  Mail, 
  User,
  Calendar,
  MessageSquare,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';

const SubscriptionConfirmationPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('payment_submitted');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPendingRegistrations();
  }, [currentPage, statusFilter]);

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('rx_admin_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/pending-registrations?page=${currentPage}&limit=10&status=${statusFilter}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPendingUsers(data.data.users);
        setTotalPages(data.data.pagination.pages);
      } else {
        console.error('Failed to fetch pending registrations');
      }
    } catch (error) {
      console.error('Error fetching pending registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, action) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('rx_admin_token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/users/${userId}/registration-status`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action,
            adminNotes: adminNotes.trim() || undefined
          })
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert(`Registration ${action}d successfully!`);
        setShowModal(false);
        setSelectedUser(null);
        setAdminNotes('');
        fetchPendingRegistrations(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Failed to ${action} registration: ${error.message}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing registration:`, error);
      alert(`Error ${action}ing registration. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setAdminNotes('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setAdminNotes('');
  };

  const filteredUsers = pendingUsers.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobileNumber.includes(searchTerm)
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      'payment_submitted': { color: 'bg-yellow-100 text-yellow-800', text: 'Payment Submitted', icon: Clock },
      'approved': { color: 'bg-green-100 text-green-800', text: 'Approved', icon: CheckCircle },
      'rejected': { color: 'bg-red-100 text-red-800', text: 'Rejected', icon: XCircle },
      'pending_payment': { color: 'bg-gray-100 text-gray-800', text: 'Pending Payment', icon: AlertCircle }
    };

    const config = statusConfig[status] || statusConfig['pending_payment'];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Subscription Confirmations</h1>
        <p className="text-gray-400">Review and approve user registrations with payment proof</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, or mobile number..."
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-4 h-4" />
          <select
            className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="payment_submitted">Payment Submitted</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Registrations</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  User Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Payment Proof
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium">No registrations found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-300" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.fullName}</div>
                          <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <div className="flex items-center mb-1">
                          <Phone className="h-3 w-3 text-gray-400 mr-1" />
                          {user.mobileNumber}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 text-gray-400 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.paymentProofUrl ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                              <img
                                src={user.paymentProofUrl}
                                alt="Payment proof thumbnail"
                                className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => window.open(user.paymentProofUrl, '_blank')}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div style={{ display: 'none' }} className="w-full h-full bg-red-50 flex items-center justify-center">
                                <AlertCircle className="h-4 w-4 text-red-400" />
                              </div>
                            </div>
                            <span className="text-xs text-green-600 font-medium">Uploaded</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </div>
                            <span className="text-xs text-red-600 font-medium">Missing</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.registrationStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal(user)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-300">
                  Page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-600 bg-gray-800 text-sm font-medium text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-gray-700 w-11/12 max-w-2xl shadow-lg rounded-md bg-gray-900">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Review Registration</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* User Information */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-3">User Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-400">Full Name</label>
                      <p className="text-sm text-white">{selectedUser.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Email</label>
                      <p className="text-sm text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Mobile Number</label>
                      <p className="text-sm text-white">{selectedUser.mobileNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400">Registration Date</label>
                      <p className="text-sm text-white">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Proof */}
                <div className="bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-3">Payment Proof</h4>
                  {selectedUser.paymentProofUrl ? (
                    <div className="space-y-3">
                      <div className="relative bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 p-4">
                        <img
                          src={selectedUser.paymentProofUrl}
                          alt="Payment Proof"
                          className="max-w-full max-h-80 mx-auto rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                          onClick={() => window.open(selectedUser.paymentProofUrl, '_blank')}
                        />
                        <div style={{ display: 'none' }} className="text-center py-8">
                          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-2" />
                          <p className="text-red-400 text-sm font-medium">Failed to load payment proof image</p>
                          <p className="text-gray-400 text-xs mt-1">The image may be corrupted or the URL is invalid</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Click image to view full size</span>
                        <a
                          href={selectedUser.paymentProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-gray-600 text-gray-200 rounded-full hover:bg-gray-500 transition-colors duration-200"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Open in new tab
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600">
                      <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300 font-medium">No payment proof uploaded</p>
                      <p className="text-gray-400 text-sm mt-1">User has not submitted payment verification</p>
                    </div>
                  )}
                </div>

                {/* Admin Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Notes (Optional)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-white"
                    placeholder="Add any notes about this registration..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={closeModal}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAction(selectedUser._id, 'reject')}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleAction(selectedUser._id, 'approve')}
                    disabled={actionLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {actionLoading ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionConfirmationPage;
