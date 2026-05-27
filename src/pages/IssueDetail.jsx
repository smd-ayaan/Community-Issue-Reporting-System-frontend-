import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import api from '../utils/api';

export default function IssueDetail() {
    const { id } = useParams();
    const [issue, setIssue] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchIssue();
        fetchComments();
    }, [id]);

    const fetchIssue = async () => {
        try {
            const { data } = await api.get(`/issues/${id}`);
            setIssue(data.issue);
            setLoading(false);
        } catch (err) {
            setError('Issue not found');
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const { data } = await api.get(`/issues/${id}/comments`);
            setComments(data.comments);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await api.post(`/issues/${id}/comments`, { content: newComment });
            setNewComment('');
            fetchComments();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}`);
            fetchComments();
        } catch (err) {
            setError('Failed to delete comment');
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;
    if (!issue) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <button onClick={() => navigate('/')} className="mb-4 text-blue-500">← Back</button>

            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
                {issue.imageUrl && (
                <img src={issue.imageUrl} alt={issue.title} className="w-full h-96 object-cover rounded mb-6" />
                )}

                <h2 className="text-3xl font-bold mb-4">{issue.title}</h2>
                <p className="text-gray-600 mb-4">{issue.description}</p>

                <div className="flex gap-4 mb-6">
                    <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded">{issue.category}</span>
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded">{issue.status}</span>
                </div>

                <p className="text-gray-500 mb-2"><strong>Location:</strong> {issue.location}</p>
                <p className="text-gray-500 mb-6"><strong>Reported by:</strong> {issue.user.name}</p>

                <hr className="my-8" />

                <h3 className="text-2xl font-bold mb-4">Comments ({comments.length})</h3>

                <form onSubmit={handleAddComment} className="mb-6">
                    <textarea
                        placeholder="Add a comment..."
                        className="w-full p-2 border rounded mb-2"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Comment
                    </button>
                </form>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-4 rounded border">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-bold">{comment.user.name}</p>
                                    <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                                </div>
                                {(comment.userId === user?.id || user?.role === 'ADMIN') && (
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    className="text-red-500 text-sm hover:underline"
                                >
                                    Delete
                                </button>
                                )}
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                        </div>
                    ))}
                </div>

                {comments.length === 0 && <p className="text-gray-500">No comments yet</p>}
            </div>
        </div>
    );
}