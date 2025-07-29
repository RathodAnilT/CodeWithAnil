import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/axiosConfig';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import DOMPurify from 'dompurify';
import { BLOG_PATHS, NEWSLETTER_PATHS } from '../utils/apiPaths';

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const { currentUser } = useAuth();
  
  // Sample blog data for development and fallback
  const sampleBlogs = [
    {
      id: 1,
      title: "Mastering Array Techniques for Coding Interviews",
      summary: "Learn essential array manipulation techniques that will help you solve problems efficiently in coding interviews.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor sem eget leo vehicula, eget sagittis magna volutpat.",
      category: "DSA",
      tags: ["Arrays", "Algorithms", "Interview Prep"],
      coverImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      publishedAt: "2023-09-15T10:00:00Z",
      readTime: 8,
      author: {
        name: "Anil Rathod",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      }
    },
    {
      id: 2,
      title: "Building Responsive UI with React and Tailwind CSS",
      summary: "A step-by-step guide to building modern, responsive user interfaces using React and Tailwind CSS.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor sem eget leo vehicula, eget sagittis magna volutpat.",
      category: "Web Development",
      tags: ["React", "Tailwind CSS", "Frontend"],
      coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      publishedAt: "2023-09-10T08:30:00Z",
      readTime: 10,
      author: {
        name: "Maya Patel",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
      }
    },
    {
      id: 3,
      title: "Understanding System Design: Scaling Databases",
      summary: "Learn about different strategies for scaling databases in large-scale applications.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor sem eget leo vehicula, eget sagittis magna volutpat.",
      category: "System Design",
      tags: ["Databases", "Scaling", "Architecture"],
      coverImage: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      publishedAt: "2023-09-05T14:15:00Z",
      readTime: 12,
      author: {
        name: "Rajiv Kumar",
        avatar: "https://randomuser.me/api/portraits/men/47.jpg"
      }
    },
    {
      id: 4,
      title: "Cracking the Coding Interview: Preparation Guide",
      summary: "A comprehensive guide to preparing for coding interviews at top tech companies.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor sem eget leo vehicula, eget sagittis magna volutpat.",
      category: "Interview Prep",
      tags: ["Career", "Interview", "Coding"],
      coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      publishedAt: "2023-08-28T11:45:00Z",
      readTime: 15,
      author: {
        name: "Anil Rathod",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg"
      }
    },
    {
      id: 5,
      title: "Modern JavaScript: ES6 and Beyond",
      summary: "Exploring advanced JavaScript features and best practices for modern development.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor sem eget leo vehicula, eget sagittis magna volutpat.",
      category: "JavaScript",
      tags: ["ES6", "JavaScript", "Web Development"],
      coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      publishedAt: "2023-08-20T09:30:00Z",
      readTime: 9,
      author: {
        name: "Priya Singh",
        avatar: "https://randomuser.me/api/portraits/women/33.jpg"
      }
    },
    {
      id: 6,
      title: "Advanced Python: Decorators and Context Managers",
      summary: "Learn how to write clean, maintainable Python code using advanced language features.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor sem eget leo vehicula, eget sagittis magna volutpat.",
      category: "Python",
      tags: ["Python", "Programming", "Advanced"],
      coverImage: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
      publishedAt: "2023-08-15T16:20:00Z",
      readTime: 11,
      author: {
        name: "Vivek Sharma",
        avatar: "https://randomuser.me/api/portraits/men/62.jpg"
      }
    }
  ];
  
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const blogs = await API.get(BLOG_PATHS.ALL);
      setBlogs(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blogs.');
      setBlogs(sampleBlogs);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBlogs();
  }, []);
  
  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!email || !validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    
    try {
      setSubscribing(true);
      await API.post(NEWSLETTER_PATHS.SUBSCRIBE, { email });
      toast.success('Subscribed to newsletter successfully!');
      setEmail('');
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      toast.error('Failed to subscribe. Please try again later.');
    } finally {
      setSubscribing(false);
    }
  };
  
  const categories = ['DSA', 'Web Development', 'System Design', 'Interview Prep', 'JavaScript', 'Python'];
  
  const filteredBlogs = blogs.filter(blog => {
    const matchesCategory = category === 'all' || blog.category === category;
    const matchesSearch = searchQuery === '' || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (blog.summary && blog.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Technical Articles & Tutorials
            </motion.h1>
            <motion.p 
              className="mt-3 max-w-2xl mx-auto text-xl text-blue-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Insights on DSA, web development, system design, and more
            </motion.p>
            
            {currentUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8"
              >
                <Link 
                  to="/blogs/create" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 transition-colors duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Write an Article
                </Link>
              </motion.div>
            )}
          </div>
        </div>
        {/* Wave separator */}
        <div className="h-16 relative">
          <svg className="absolute bottom-0 w-full h-16" preserveAspectRatio="none" viewBox="0 0 1440 48">
            <path
              fill="#F9FAFB"
              d="M0 48h1440V0c-286.7 48-571.3 48-858 0s-439.7-48-582 0z"
            />
          </svg>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and filters */}
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
              <svg className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                category === 'all' 
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition-colors duration-300`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  category === cat 
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors duration-300`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No articles found</h3>
            <p className="mt-1 text-gray-500">Try changing your search or filter criteria.</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredBlogs.map((blog) => (
              <motion.div 
                key={blog.id}
                variants={fadeIn}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/blogs/${blog.id}`} className="block">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={blog.coverImage} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80';
                      }}
                    />
                  </div>
                </Link>
                
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {blog.category}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">{formatDate(blog.publishedAt)}</span>
                    <span className="ml-auto text-xs text-gray-500">{blog.readTime} min read</span>
                  </div>
                  
                  <Link to={`/blogs/${blog.id}`}>
                    <h3 className="font-bold text-xl mb-2 text-gray-900 hover:text-blue-600 transition-colors duration-300">{blog.title}</h3>
                  </Link>
                  
                  <div 
                    className="text-gray-600 text-sm mb-4 line-clamp-3" 
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.summary?.substring(0, 150) + (blog.summary?.length > 150 ? '...' : '') || '') }}
                  />
                  
                  <div className="flex items-center">
                    <img 
                      src={blog.author?.avatar} 
                      alt={blog.author?.name} 
                      className="w-8 h-8 rounded-full mr-2"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://randomuser.me/api/portraits/lego/1.jpg';
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700">{blog.author?.name || 'Anonymous'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Newsletter subscription */}
        <motion.div 
          className="mt-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="px-6 py-12 md:p-12 lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Subscribe to our newsletter</h2>
              <p className="mt-4 text-base text-blue-100">Get the latest articles and resources directly to your inbox.</p>
            </div>
            <div className="mt-8 lg:mt-0 lg:w-1/2">
              <form onSubmit={handleSubscribe} className="sm:flex">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3 rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  placeholder="Enter your email"
                />
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <button
                    type="submit"
                    className="w-full bg-indigo-900 text-white px-5 py-3 rounded-md font-medium hover:bg-indigo-800 transition-colors duration-300"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
              <p className="mt-3 text-sm text-blue-100">
                We care about your data. Read our{' '}
                <a href="#" className="text-white underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Blogs; 