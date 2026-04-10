import { useEffect, useState } from 'react';
import api from '../../api/axios';

const SECTIONS = ['hero', 'about', 'gallery', 'rewards', 'footer'];

export default function Media() {
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({});

  const fetchSection = async (section) => {
    try {
      const res = await api.get(`/public/media/${section}`);
      setImages(prev => ({ ...prev, [section]: res.data }));
    } catch (e) { /* ignore */ }
  };

  useEffect(() => {
    Promise.all(SECTIONS.map(s => fetchSection(s))).finally(() => setLoading(false));
  }, []);

  const handleUpload = async (section, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [section]: true }));
    const form = new FormData();
    form.append('section', section);
    form.append('image', file);
    form.append('alt_text', `${section} image`);

    try {
      await api.post('/media', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      fetchSection(section);
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleDelete = async (section, mediaId) => {
    if (!confirm('Delete this image?')) return;
    await api.delete(`/media/${mediaId}`);
    fetchSection(section);
  };

  if (loading) return <div className="p-8 text-purple-400">LOADING...</div>;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gradient mb-6 tracking-wider">MEDIA MANAGEMENT</h1>
      <p className="text-gray-400 mb-6 tracking-wider">Upload and manage images for each section of the client-facing interface.</p>

      <div className="space-y-6">
        {SECTIONS.map(section => (
          <div key={section} className="bg-gray-900/90 backdrop-blur-sm rounded-lg border border-purple-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold capitalize text-gradient tracking-wider">{section}</h2>
              <label className="cursor-pointer">
                <span className="px-3 py-2 bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white rounded-lg text-xs font-medium border border-purple-600 transition-all tracking-wider inline-block">
                  {uploading[section] ? 'UPLOADING...' : '+ UPLOAD IMAGE'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleUpload(section, e)}
                  className="hidden"
                  disabled={uploading[section]}
                />
              </label>
            </div>

            {images[section] && images[section].length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images[section].map(img => (
                  <div key={img.id} className="relative group">
                    <img src={img.url} alt={img.alt_text} className="w-full h-32 object-cover rounded-lg border border-purple-900" />
                    <button
                      onClick={() => handleDelete(section, img.id)}
                      className="absolute top-1 right-1 bg-red-900 hover:bg-red-800 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-sm border border-red-700"
                    >
                      ×
                    </button>
                    {img.alt_text && <p className="text-xs text-gray-400 mt-1 truncate tracking-wider">{img.alt_text}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-8 tracking-wider">NO IMAGES UPLOADED YET</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
