import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Edit, Trash2, MapPin, Star, Image } from 'lucide-react';
import { API_BASE_URL } from '../config';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const categories = ['Nature', 'Historical', 'Cultural', 'Adventure', 'Beach', 'Urban', 'Religious', 'Entertainment'];

  useEffect(() => {
    fetchDestinations();
  }, [currentPage, searchQuery, selectedCategory]);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchQuery && { q: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
      });

      const response = await fetch(`${API_BASE_URL}/api/admin/destinations?${params}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDestinations(data.destinations);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this destination? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/destinations/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        const data = await response.json();

        if (response.ok && data.success) {
          alert(data.message || 'Destination deleted successfully!');
          fetchDestinations();
        } else {
          alert(data.message || 'Failed to delete destination');
        }
      } catch (error) {
        console.error('Error deleting destination:', error);
        alert('Network error. Please try again.');
      }
    }
  };

  const DestinationModal = ({ isOpen, onClose, destination, isEdit }) => {
    const [formData, setFormData] = useState({
      name: '',
      photos: { main: '', others: [] },
      geo: { lat: '', lng: '' },
      category: '',
      description: '',
      address: '',
      tags: []
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
      if (destination && isEdit) {
        setFormData(destination);
      } else {
        setFormData({
          name: '',
          photos: { main: '', others: [] },
          geo: { lat: '', lng: '' },
          category: '',
          description: '',
          address: '',
          tags: []
        });
      }
    }, [destination, isEdit]);

    const handleImageUpload = async (file, isMain = true) => {
      try {
        setUploading(true);
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/api/admin/uploads/image`, {
          method: 'POST',
          credentials: 'include',
          body: uploadFormData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            if (isMain) {
              setFormData(prev => ({
                ...prev,
                photos: { ...prev.photos, main: data.url }
              }));
            } else {
              setFormData(prev => ({
                ...prev,
                photos: {
                  ...prev.photos,
                  others: [...prev.photos.others, data.url].slice(0, 3)
                }
              }));
            }
          } else {
            alert(data.message || 'Upload failed');
          }
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Network error during upload');
      } finally {
        setUploading(false);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Validate required fields
      if (!formData.name || !formData.photos.main || !formData.geo.lat || !formData.geo.lng || !formData.category) {
        alert('Please fill in all required fields (Name, Main Photo, Coordinates, Category)');
        return;
      }

      try {
        const url = isEdit 
          ? `${API_BASE_URL}/api/admin/destinations/${destination._id}`
          : `${API_BASE_URL}/api/admin/destinations`;
        
        const method = isEdit ? 'PATCH' : 'POST';

        const submitData = {
          ...formData,
          geo: {
            lat: parseFloat(formData.geo.lat),
            lng: parseFloat(formData.geo.lng)
          },
          tags: Array.isArray(formData.tags) 
            ? formData.tags 
            : (formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [])
        };

        const response = await fetch(url, {
          method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submitData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          alert(data.message || `Destination ${isEdit ? 'updated' : 'created'} successfully!`);
          fetchDestinations();
          onClose();
        } else {
          alert(data.message || `Failed to ${isEdit ? 'update' : 'create'} destination`);
        }
      } catch (error) {
        console.error('Error saving destination:', error);
        alert('Network error. Please try again.');
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">
              {isEdit ? 'Edit Destination' : 'Add New Destination'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.geo.lat}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    geo: { ...prev.geo, lat: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={formData.geo.lng}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    geo: { ...prev.geo, lng: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Main Photo *</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], true)}
                  className="hidden"
                  id="main-photo"
                />
                <label
                  htmlFor="main-photo"
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-pointer hover:bg-gray-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload Main Photo'}
                </label>
                {formData.photos.main && (
                  <div className="relative">
                    <img src={formData.photos.main} alt="Main" className="w-16 h-16 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, photos: { ...prev.photos, main: '' } }))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Additional Photos (up to 3)</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0], false)}
                    className="hidden"
                    id="additional-photos"
                    disabled={formData.photos.others.length >= 3}
                  />
                  <label
                    htmlFor="additional-photos"
                    className={`px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white cursor-pointer hover:bg-gray-700 ${
                      formData.photos.others.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploading ? 'Uploading...' : 'Add Photo'}
                  </label>
                  <span className="text-gray-400 text-sm">
                    {formData.photos.others.length}/3 photos
                  </span>
                </div>
                {formData.photos.others.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.photos.others.map((photo, index) => (
                      <div key={index} className="relative">
                        <img src={photo} alt={`Additional ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              photos: {
                                ...prev.photos,
                                others: prev.photos.others.filter((_, i) => i !== index)
                              }
                            }));
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
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
                disabled={uploading}
                className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                {isEdit ? 'Update' : 'Create'}
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
          <h1 className="text-3xl font-bold text-white">Destinations</h1>
          <p className="text-gray-400 mt-1">Manage travel destinations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <motion.div
              key={destination._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-colors"
            >
              <div className="aspect-video bg-gray-800 relative">
                {destination.photos?.main ? (
                  <img
                    src={destination.photos.main}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Image className="h-12 w-12 text-gray-600" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => {
                      setSelectedDestination(destination);
                      setShowEditModal(true);
                    }}
                    className="p-2 bg-black bg-opacity-50 rounded-lg text-white hover:bg-opacity-75"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(destination._id)}
                    className="p-2 bg-black bg-opacity-50 rounded-lg text-white hover:bg-opacity-75"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white text-lg">{destination.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-white text-sm">{destination.averageRating || 0}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">{destination.category}</span>
                  </div>
                  
                  {destination.address && (
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{destination.address}</span>
                    </div>
                  )}
                  
                  {destination.description && (
                    <p className="text-gray-400 text-sm line-clamp-2">{destination.description}</p>
                  )}
                  
                  {destination.tags && destination.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {destination.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                      {destination.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded">
                          +{destination.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
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

      {/* Modals */}
      <DestinationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        destination={null}
        isEdit={false}
      />
      <DestinationModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        destination={selectedDestination}
        isEdit={true}
      />
    </div>
  );
};

export default DestinationsPage;
