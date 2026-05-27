import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import api from '../utils/api';

export default function CreateIssue() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'POTHOLE',
        location: '',
    });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('location', formData.location);
            if (image) data.append('image', image);

            await api.post('/issues', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create issue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Report an Issue</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full p-2 border rounded mb-4"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                    />

                    <textarea
                        placeholder="Description"
                        className="w-full p-2 border rounded mb-4 h-24"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                    />

                    <select
                        className="w-full p-2 border rounded mb-4"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option value="POTHOLE">Pothole</option>
                        <option value="GARBAGE">Garbage</option>
                        <option value="WATER_LEAK">Water Leak</option>
                        <option value="STREET_LIGHT">Street Light</option>
                        <option value="TRAFFIC">Traffic</option>
                        <option value="SAFETY">Safety</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Location"
                        className="w-full p-2 border rounded mb-4"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                    />

                    <input
                        type="file"
                        accept="image/*"
                        className="w-full p-2 border rounded mb-4"
                        onChange={(e) => setImage(e.target.files[0])}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    >
                        {loading ? 'Creating...' : 'Report Issue'}
                    </button>
                </form>
            </div>
        </div>
    );
}