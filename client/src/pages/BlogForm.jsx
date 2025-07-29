import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../utils/axiosConfig';
import useAuth from '../hooks/useAuth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { BLOG_PATHS } from '../utils/apiPaths';

const CATEGORIES = [
  'DSA', 'Web Development', 'Mobile Development', 'DevOps', 
  'Machine Learning', 'System Design', 'Interview Prep', 'Career Growth'
];

function BlogForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useAuth();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: '',
    tags: '',
    coverImage: '',
    readTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  
  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login', { state: { from: `/blogs/${isEditMode ? 'edit/' + id : 'new'}` } });
      return;
    }
    
    // Fetch blog data if in edit mode
    if (isEditMode) {
      const fetchBlog = async () => {
        try {
          setLoading(true);
          const blog = await API.get(BLOG_PATHS.SINGLE(id));
          
          // Check if user is the author
          if (currentUser.id !== blog.author?.id) {
            navigate('/blogs');
            toast.error("You don't have permission to edit this blog");
            return;
          }
          
          setFormData({
            title: blog.title || '',
            summary: blog.summary || '',
            content: blog.content || '',
            category: blog.category || '',
            tags: blog.tags ? blog.tags.join(', ') : '',
            coverImage: blog.coverImage || '',
            readTime: blog.readTime || ''
          });
          
          if (blog.coverImage) {
            setPreviewImage(blog.coverImage);
          }
          
          setLoading(false);
        } catch (err) {
          console.error('Failed to fetch blog:', err);
          setLoading(false);
          toast.error('Failed to load blog data. Please try again.');
          navigate('/blogs');
        }
      };
      
      fetchBlog();
    }
  }, [currentUser, id, isEditMode, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleEditorChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }));
    }
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ 
        ...prev, 
        coverImage: 'Please upload an image file (JPEG, PNG, GIF, WEBP)' 
      }));
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ 
        ...prev, 
        coverImage: 'Image size should be less than 5MB' 
      }));
      return;
    }
    
    try {
      setUploadingImage(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Here you would normally upload to your server or a cloud service
      // For this example, we'll just simulate an upload delay
      // In a real application, replace this with your actual image upload logic
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Normally you'd get the URL from your server response
      // For now, we'll just use the FileReader result as our "uploaded" URL
      const uploadedUrl = reader.result;
      
      setFormData(prev => ({ ...prev, coverImage: uploadedUrl }));
      setUploadingImage(false);
      setErrors(prev => ({ ...prev, coverImage: '' }));
      
      toast.success('Image uploaded successfully');
    } catch (err) {
      console.error('Failed to upload image:', err);
      setUploadingImage(false);
      setErrors(prev => ({ 
        ...prev, 
        coverImage: 'Failed to upload image. Please try again.' 
      }));
      toast.error('Failed to upload image');
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.summary.trim()) newErrors.summary = 'Summary is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.readTime) {
      newErrors.readTime = 'Read time is required';
    } else if (isNaN(formData.readTime) || Number(formData.readTime) <= 0) {
      newErrors.readTime = 'Read time must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementsByName(firstErrorField)[0];
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    try {
      setLoading(true);
      
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        readTime: parseInt(formData.readTime, 10)
      };
      
      let response;
      
      if (!id) {
        response = await API.post(BLOG_PATHS.CREATE, blogData);
        toast.success('Blog created successfully!');
      } else {
        response = await API.put(BLOG_PATHS.UPDATE(id), blogData);
        toast.success('Blog updated successfully!');
      }
      
      navigate(`/blogs/${response.id || id}`);
    } catch (err) {
      console.error('Failed to save blog:', err);
      setLoading(false);
      
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || 'Failed to save blog. Please try again.');
      }
    }
  };
  
  if (loading && !formData.title) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  };

  // Add some custom styling to fix the text color in the editor
  const quillStyles = `
    .ql-editor {
      color: #333;
      background-color: white;
      min-height: 200px;
    }
    .ql-toolbar {
      background-color: #f1f5f9;
      border-top-left-radius: 0.375rem;
      border-top-right-radius: 0.375rem;
    }
  `;

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 md:px-10">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              {isEditMode ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className="mt-2 text-blue-100">
              {isEditMode 
                ? 'Update your article with the latest information' 
                : 'Share your knowledge with the community'}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 text-gray-100">
          
            {/* Custom styles for quill editor */}
            <style>{quillStyles}</style>
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a descriptive title"
                className={`w-full px-4 py-2 bg-gray-700 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white ${
                  errors.title && submitAttempted ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.title && submitAttempted && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>
            
            {/* Summary */}
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-200 mb-1">
                Summary *
              </label>
              <textarea
                name="summary"
                id="summary"
                rows="3"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Write a brief summary of your article"
                className={`w-full px-4 py-2 bg-gray-700 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white ${
                  errors.summary && submitAttempted ? 'border-red-500' : 'border-gray-600'
                }`}
              />
              {errors.summary && submitAttempted && (
                <p className="mt-1 text-sm text-red-400">{errors.summary}</p>
              )}
              <p className="mt-1 text-sm text-gray-400">
                A good summary helps readers understand what your article is about.
              </p>
            </div>
            
            {/* Category and Read Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white ${
                    errors.category && submitAttempted ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && submitAttempted && (
                  <p className="mt-1 text-sm text-red-400">{errors.category}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="readTime" className="block text-sm font-medium text-gray-200 mb-1">
                  Read Time (minutes) *
                </label>
                <input
                  type="number"
                  name="readTime"
                  id="readTime"
                  min="1"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="Estimated read time"
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white ${
                    errors.readTime && submitAttempted ? 'border-red-500' : 'border-gray-600'
                  }`}
                />
                {errors.readTime && submitAttempted && (
                  <p className="mt-1 text-sm text-red-400">{errors.readTime}</p>
                )}
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-200 mb-1">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Enter tags separated by commas (e.g. React, JavaScript, Web Development)"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
              />
              <p className="mt-1 text-sm text-gray-400">
                Tags help categorize your article and make it more discoverable.
              </p>
            </div>
            
            {/* Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-200 mb-1">
                Cover Image
              </label>
              
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
                <label
                  htmlFor="imageUpload"
                  className={`px-4 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none ${
                    uploadingImage ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                  }`}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </label>
                {formData.coverImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, coverImage: '' }));
                      setPreviewImage('');
                    }}
                    className="ml-3 px-2 py-1 border border-transparent text-sm font-medium rounded-md text-red-300 bg-red-900 hover:bg-red-800 focus:outline-none"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              {errors.coverImage && (
                <p className="mt-1 text-sm text-red-400">{errors.coverImage}</p>
              )}
              
              {previewImage && (
                <div className="mt-4 relative">
                  <img
                    src={previewImage}
                    alt="Cover preview"
                    className="w-full h-56 object-cover rounded-lg shadow-sm"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              )}
              
              <p className="mt-1 text-sm text-gray-400">
                A captivating image will make your article more engaging. Maximum size: 5MB.
              </p>
            </div>
            
            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-1">
                Content *
              </label>
              <div 
                className={`border rounded-md ${errors.content && submitAttempted ? 'border-red-500' : 'border-gray-600'}`}
              >
                <ReactQuill
                  value={formData.content}
                  onChange={handleEditorChange}
                  modules={quillModules}
                  placeholder="Write your article content here..."
                  className="h-64 sm:h-96 text-black bg-white"
                />
              </div>
              {errors.content && submitAttempted && (
                <p className="mt-1 text-sm text-red-400">{errors.content}</p>
              )}
              <p className="mt-1 text-sm text-gray-400">
                Use the toolbar to format your content, add links, images, and more.
              </p>
            </div>
            
            {/* Form Actions */}
            <div className="pt-5 border-t border-gray-600 flex justify-between items-center">
              <Link
                to="/blogs"
                className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-200 bg-gray-700 hover:bg-gray-600 focus:outline-none"
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEditMode ? 'Updating...' : 'Publishing...'}
                  </span>
                ) : (
                  isEditMode ? 'Update Article' : 'Publish Article'
                )}
              </button>
            </div>
          </form>
        </motion.div>
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-700">
          <h2 className="text-lg font-medium text-white mb-3">Tips for a great article</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex">
              <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Use clear, concise language and break up content with headings.</span>
            </li>
            <li className="flex">
              <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Include code examples, images, or diagrams to illustrate your points.</span>
            </li>
            <li className="flex">
              <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Reference sources and provide links when citing external information.</span>
            </li>
            <li className="flex">
              <svg className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Proofread your article before publishing to catch any errors.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BlogForm; 