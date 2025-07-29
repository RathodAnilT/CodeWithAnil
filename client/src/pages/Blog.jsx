import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import API from '../utils/axiosConfig';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import DOMPurify from 'dompurify';
import { formatDistanceToNow } from 'date-fns';
import { BLOG_PATHS } from '../utils/apiPaths';

function Blog() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const blog = await API.get(BLOG_PATHS.SINGLE(id));
        setBlog(blog);
        setError(null);
        
        // Fetch related posts based on category
        if (blog.category) {
          const relatedPosts = await API.get(BLOG_PATHS.BY_CATEGORY(blog.category));
          setRelatedPosts(relatedPosts.filter(post => post._id !== id));
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog. Please try again later.');
        toast.error('Failed to load blog. Please try again later.');
        
        // Use sample blog as fallback
        setBlog({
          title: 'Understanding React Hooks: A Comprehensive Guide',
          content: `<h2>Introduction to React Hooks</h2>
<p>React Hooks are a powerful feature that allows you to use state and other React features without writing a class. They were introduced in React 16.8 and have revolutionized how developers write React components.</p>
<h2>The useState Hook</h2>
<p>The useState hook allows you to add state to functional components:</p>
<pre><code>
const [count, setCount] = useState(0);
</code></pre>
<h2>The useEffect Hook</h2>
<p>The useEffect hook allows you to perform side effects in your components:</p>
<pre><code>
useEffect(() => {
  document.title = \`You clicked \${count} times\`;
}, [count]);
</code></pre>
<h2>Additional Hooks</h2>
<p>React provides several built-in hooks like useContext, useReducer, useCallback, useMemo, and useRef.</p>
<h2>Custom Hooks</h2>
<p>You can create your own hooks to extract component logic into reusable functions.</p>
<h2>Conclusion</h2>
<p>React Hooks provide a more direct API to React concepts you already know: props, state, context, refs, and lifecycle.</p>`,
          author: { 
            name: 'Anil Rathod',
            profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
          },
          coverImage: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          category: 'Web Development',
          readTime: 12,
          tags: ['React', 'JavaScript', 'Web Development']
        });
        
        // Sample related posts
        setRelatedPosts([
          {
            _id: 'sample1',
            title: 'Getting Started with React',
            summary: 'Learn how to create your first React application from scratch',
            coverImage: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974',
            author: { name: 'Jane Cooper' },
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
          },
          {
            _id: 'sample2',
            title: 'React Performance Optimization',
            summary: 'Techniques to make your React applications faster',
            coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb',
            author: { name: 'John Smith' },
            createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
    // Scroll to top when loading a new blog
    window.scrollTo(0, 0);
  }, [id]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getTimeAgo = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    try {
      await API.delete(BLOG_PATHS.DELETE(id));
      toast.success('Blog deleted successfully');
      navigate('/blogs');
    } catch (err) {
      console.error('Failed to delete blog:', err);
      toast.error('Failed to delete blog. Please try again.');
      setConfirmDelete(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Blog not found</h2>
        <p className="mt-2 text-gray-600">The blog you're looking for doesn't exist or has been removed.</p>
        <Link to="/blogs" className="mt-6 inline-block text-blue-600 hover:text-blue-800">
          ← Back to blog list
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gray-900 text-white"
      >
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={blog.coverImage || 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4'} 
            alt={blog.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-24 md:py-32">
          <Link to="/blogs" className="inline-flex items-center text-sm font-medium text-blue-300 hover:text-blue-200 mb-6">
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to blogs
          </Link>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            {blog.title}
          </h1>
          
          <div className="mt-6 flex items-center">
            <img 
              src={blog.author?.profilePicture || 'https://randomuser.me/api/portraits/men/1.jpg'} 
              alt={blog.author?.name || 'Author'}
              className="h-10 w-10 rounded-full mr-3"
            />
            <div>
              <p className="font-medium">{blog.author?.name || 'Anonymous'}</p>
              <div className="flex items-center text-sm text-gray-300">
                <span>{formatDate(blog.createdAt)}</span>
                <span className="mx-2">•</span>
                <span>{blog.readTime || 5} min read</span>
                {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                  <>
                    <span className="mx-2">•</span>
                    <span>Updated {getTimeAgo(blog.updatedAt)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {blog.category && (
            <span className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {blog.category}
            </span>
          )}
        </div>
      </motion.div>
      
      {/* Blog Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-3xl mx-auto px-4 sm:px-6 py-12"
      >
        {/* Admin controls */}
        {currentUser && currentUser.role === 'admin' && (
          <div className="mb-8 flex items-center justify-end space-x-4 border-b pb-6">
            <Link
              to={`/blogs/edit/${id}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Blog
            </Link>
            
            <button
              onClick={handleDelete}
              className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                confirmDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
              } focus:outline-none`}
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {confirmDelete ? 'Confirm Delete' : 'Delete Blog'}
            </button>
          </div>
        )}
        
        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Main content */}
        <article className="prose prose-lg max-w-none">
          <div 
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
          />
        </article>
        
        {/* Author section */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex items-center">
            <img 
              src={blog.author?.profilePicture || 'https://randomuser.me/api/portraits/men/1.jpg'} 
              alt={blog.author?.name || 'Author'}
              className="h-16 w-16 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-bold">Written by {blog.author?.name || 'Anonymous'}</h3>
              <p className="text-gray-600">
                {blog.author?.bio || 'Software developer passionate about web technologies and sharing knowledge.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <Link 
                  key={post._id}
                  to={`/blogs/${post._id}`} 
                  className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full transform transition-transform hover:scale-105"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={post.coverImage || 'https://source.unsplash.com/random/800x600?programming'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{post.title}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.summary}</p>
                    <div className="mt-4 pt-2 border-t text-xs text-gray-500 flex justify-between items-center">
                      <span>{post.author?.name || 'Anonymous'}</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Call to action */}
      <div className="bg-blue-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Enjoyed this article?</h2>
          <p className="mt-4 text-lg text-gray-600">Check out more content or create your own article to share your knowledge.</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/blogs" 
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              View All Articles
            </Link>
            {currentUser && (
              <Link 
                to="/blogs/new" 
                className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Write an Article
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog; 