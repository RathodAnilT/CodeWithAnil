import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditBlog() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  
  const { blogId } = useParams();
  const navigate = useNavigate();
  
  const categoryOptions = ['DSA', 'Web Development', 'System Design', 'Interview Prep', 'JavaScript', 'Python'];
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };
  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`/api/blogs/${blogId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Set form data
        setTitle(response.data.title);
        setSummary(response.data.summary);
        setContent(response.data.content);
        setCategory(response.data.category);
        setCoverImage(response.data.coverImage || '');
        
        // Format tags back to comma-separated string
        if (response.data.tags && Array.isArray(response.data.tags)) {
          setTags(response.data.tags.join(', '));
        }
        
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          setError('Failed to load article. Please try again later.');
        }
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [blogId, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content || !category || !summary) {
      setError('Please fill in all required fields (title, summary, category, and content)');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const formattedTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag); // Filter out empty strings
      
      await axios.put(`/api/blogs/${blogId}`, {
        title,
        summary,
        content,
        category,
        tags: formattedTags,
        coverImage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Navigate back to the blog detail page
      navigate(`/blog/${blogId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update blog post. Please try again.');
      setSaving(false);
    }
  };
  
  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-secondary-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 mb-4">Article not found</h2>
          <p className="text-secondary-600 mb-8">The article you're trying to edit doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/blogs')}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Back to all articles
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-secondary-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-secondary-900 mb-6">Edit Article</h1>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-secondary-700">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Enter a descriptive title"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="summary" className="block text-sm font-medium text-secondary-700">
                      Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      rows="3"
                      className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Brief summary of your article (appears in previews)"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-secondary-700">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      >
                        <option value="">Select a category</option>
                        {categoryOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-secondary-700">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        id="tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="e.g. javascript, arrays, algorithms"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="coverImage" className="block text-sm font-medium text-secondary-700">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      id="coverImage"
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="mt-1 block w-full rounded-md border-secondary-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {coverImage && (
                      <div className="mt-2">
                        <img
                          src={coverImage}
                          alt="Cover preview"
                          className="h-40 w-full object-cover rounded"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-secondary-700 mb-1">
                      Content <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-secondary-300 rounded-md overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        className="bg-white h-72"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => navigate(`/blog/${blogId}`)}
                      className="py-2 px-4 border border-secondary-300 rounded-md text-secondary-700 bg-white hover:bg-secondary-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-75"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBlog; 