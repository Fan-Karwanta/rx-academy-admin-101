import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, Edit, Trash2, User, MapPin } from 'lucide-react';
import { API_BASE_URL } from '../config';

const RatingsPage = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  useEffect(() => {
    fetchRatings();
  }, [currentPage, searchQuery, minRating, maxRating]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(minRating && { min: minRating }),
        ...(maxRating && { max: maxRating }),
      });

      const response = await fetch(`${API_BASE_URL}/api/admin/ratings?${params}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRatings(data.ratings);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rating?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/ratings/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          fetchRatings();
        }
      } catch (error) {
        console.error('Error deleting rating:', error);
      }
    }
  };

  const StarRating = ({ rating, onRatingChange, editable = false }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'text-yellow-500 fill-current'
                : 'text-gray-400'
            } ${editable ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={editable ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const EditRatingModal = ({ isOpen, onClose, rating }) => {
    const [formData, setFormData] = useState({
      rating: 5,
      comment: ''
    });

    useEffect(() => {
      if (rating) {
        setFormData({
          rating: rating.rating,
          comment: rating.comment || ''
        });
      }
    }, [rating]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/ratings/${rating._id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          fetchRatings();
          onClose();
        }
      } catch (error) {
        console.error('Error updating rating:', error);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg w-full max-w-md">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Edit Rating</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
              <StarRating
                rating={formData.rating}
                onRatingChange={(newRating) => setFormData(prev => ({ ...prev, rating: newRating }))}
                editable={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Comment</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
                placeholder="Optional comment..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Ratings</h1>
          <p className="text-gray-400 mt-1">Manage destination ratings and reviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by destination or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
          />
        </div>
        <div className="flex space-x-2">
          <select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
          >
            <option value="">Min Rating</option>
            {[1, 2, 3, 4, 5].map(rating => (
              <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
            ))}
          </select>
          <select
            value={maxRating}
            onChange={(e) => setMaxRating(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
          >
            <option value="">Max Rating</option>
            {[1, 2, 3, 4, 5].map(rating => (
              <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ratings List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {ratings.map((rating) => (
            <motion.div
              key={rating._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-4">
                  {/* Rating Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <StarRating rating={rating.rating} />
                      <span className="text-gray-400 text-sm">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRating(rating);
                          setShowEditModal(true);
                        }}
                        className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(rating._id)}
                        className="p-2 bg-gray-800 rounded-lg text-white hover:bg-gray-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Destination and User Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Destination */}
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden">
                        {rating.destinationId?.photos?.main ? (
                          <img
                            src={rating.destinationId.photos.main}
                            alt={rating.destinationId.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <MapPin className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{rating.destinationId?.name}</p>
                        <p className="text-sm text-gray-400">{rating.destinationId?.category}</p>
                      </div>
                    </div>

                    {/* User */}
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden">
                        {rating.userId?.profileImage ? (
                          <img
                            src={rating.userId.profileImage}
                            alt={rating.userId.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <User className="h-6 w-6 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{rating.userId?.name}</p>
                        <p className="text-sm text-gray-400">{rating.userId?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  {rating.comment && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <p className="text-gray-300">{rating.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {ratings.length === 0 && (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No ratings found</p>
            </div>
          )}
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

      {/* Edit Modal */}
      <EditRatingModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        rating={selectedRating}
      />
    </div>
  );
};

export default RatingsPage;
