import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Archive, Download, Eye, Trash2, Upload, Search, Filter } from 'lucide-react';

const ArchiveStoragePage = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data for archives - replace with actual Supabase data
  const mockArchives = [
    {
      id: 1,
      name: 'RX Lifestyle - January 2024',
      type: 'magazine',
      size: '15.2 MB',
      uploadDate: '2024-01-15',
      downloads: 245,
      status: 'active'
    },
    {
      id: 2,
      name: 'Compensation Plan Q1 2024',
      type: 'document',
      size: '8.7 MB',
      uploadDate: '2024-01-10',
      downloads: 189,
      status: 'active'
    },
    {
      id: 3,
      name: 'Product Catalog 2024',
      type: 'catalog',
      size: '22.1 MB',
      uploadDate: '2024-01-05',
      downloads: 312,
      status: 'archived'
    },
    {
      id: 4,
      name: 'Training Materials - December 2023',
      type: 'training',
      size: '45.8 MB',
      uploadDate: '2023-12-20',
      downloads: 156,
      status: 'active'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setArchives(mockArchives);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredArchives = archives.filter(archive => {
    const matchesSearch = archive.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || archive.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type) => {
    const colors = {
      magazine: 'bg-blue-500',
      document: 'bg-green-500',
      catalog: 'bg-purple-500',
      training: 'bg-orange-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-400' : 'text-yellow-400';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Archive Storage</h1>
        <p className="text-gray-400">Manage your digital magazine archives and documents</p>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search archives..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="magazine">Magazines</option>
                <option value="document">Documents</option>
                <option value="catalog">Catalogs</option>
                <option value="training">Training</option>
              </select>
            </div>

            {/* Upload Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Upload size={16} />
              Upload New
            </button>
          </div>
        </div>
      </div>

      {/* Archives Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArchives.map((archive) => (
            <motion.div
              key={archive.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors"
            >
              {/* Archive Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(archive.type)}`}>
                    <Archive size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{archive.name}</h3>
                    <p className="text-gray-400 text-xs capitalize">{archive.type}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium ${getStatusColor(archive.status)}`}>
                  {archive.status}
                </span>
              </div>

              {/* Archive Details */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white">{archive.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Uploaded:</span>
                  <span className="text-white">{new Date(archive.uploadDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Downloads:</span>
                  <span className="text-white">{archive.downloads}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                  <Eye size={14} />
                  View
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors">
                  <Download size={14} />
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredArchives.length === 0 && (
        <div className="text-center py-12">
          <Archive size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No archives found</h3>
          <p className="text-gray-400 mb-4">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first archive to get started'
            }
          </p>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Upload Archive
          </button>
        </div>
      )}

      {/* Storage Stats */}
      <div className="mt-8 bg-gray-900 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Storage Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{archives.length}</div>
            <div className="text-gray-400 text-sm">Total Archives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {archives.reduce((sum, archive) => sum + archive.downloads, 0)}
            </div>
            <div className="text-gray-400 text-sm">Total Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {archives.filter(a => a.status === 'active').length}
            </div>
            <div className="text-gray-400 text-sm">Active Archives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">91.2 MB</div>
            <div className="text-gray-400 text-sm">Total Storage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveStoragePage;
