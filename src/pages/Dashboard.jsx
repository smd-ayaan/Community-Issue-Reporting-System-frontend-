import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import api from '../utils/api';

export default function Dashboard() {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ category: '', status: '' });
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchIssues();
    }, [filter]);

    const fetchIssues = async () => {
        try {
            const params = {};
            if (filter.category) params.category = filter.category;
            if (filter.status) params.status = filter.status;
            const { data } = await api.get('/issues', { params });
            setIssues(data.issues);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Community Issues</h1>
                <div className="flex gap-4 items-center">
                    <span className="text-gray-600">{user?.name}</span>
                    <Link to="/create-issue" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Report Issue
                    </Link>
                    <button onClick={handleLogout} className="text-red-500">Logout</button>
                </div>
            </nav>

            <div className="p-8">
                <div className="flex gap-4 mb-6">
                    <select
                        className="p-2 border rounded"
                        value={filter.category}
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    >
                        <option value="">All Categories</option>
                        <option value="POTHOLE">Pothole</option>
                        <option value="GARBAGE">Garbage</option>
                        <option value="WATER_LEAK">Water Leak</option>
                        <option value="STREET_LIGHT">Street Light</option>
                        <option value="TRAFFIC">Traffic</option>
                        <option value="SAFETY">Safety</option>
                        <option value="OTHER">Other</option>
                    </select>

                    <select
                        className="p-2 border rounded"
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                    >
                        <option value="">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {issues.map((issue) => (
                        <Link
                        key={issue.id}
                        to={`/issues/${issue.id}`}
                        className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                        >
                        {issue.imageUrl && (
                            <img src={issue.imageUrl} alt={issue.title} className="w-full h-48 object-cover rounded mb-4" />
                        )}
                        <h3 className="font-bold text-lg mb-2">{issue.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{issue.description.slice(0, 100)}...</p>
                        <div className="flex gap-2 text-xs">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{issue.category}</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{issue.status}</span>
                        </div>
                        <p className="text-gray-500 text-xs mt-2">{issue.location}</p>
                        </Link>
                    ))}
                </div>

                {issues.length === 0 && (
                <p className="text-center text-gray-500 mt-8">No issues found</p>
                )}
            </div>
        </div>
    );
}   