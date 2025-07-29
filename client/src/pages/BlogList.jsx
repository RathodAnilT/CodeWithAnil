import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/axiosConfig';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { BLOG_PATHS } from '../utils/apiPaths';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample blog data for development
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
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const blogs = await API.get(BLOG_PATHS.ALL);
        setBlogs(blogs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs.');
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);
  
  const categories = ['DSA', 'Web Development', 'System Design', 'Interview Prep', 'JavaScript', 'Python'];
  
  const filteredBlogs = Array.isArray(blogs) ? blogs.filter(blog => {
    const matchesCategory = category === 'all' || blog.category === category;
    const matchesSearch = searchQuery === '' || 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (blog.summary && blog.summary.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }) : [];
  
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
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <div className="absolute left-3 top-3.5">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === 'all' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All
            </button>
            
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {/* Blog posts */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-red-500 mb-3">{error}</p>
            <p className="text-gray-600">Showing sample articles instead.</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M9 19h6m-3-4v4m-6-1a7 7 0 1114 0h-1M5 12h14" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No articles found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredBlogs.map(blog => (
              <motion.div
                key={blog.id}
                variants={fadeIn}
                className="flex flex-col bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100"
              >
                {blog.coverImage && (
                  <div className="flex-shrink-0 relative h-48 overflow-hidden">
                    <img className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" src={blog.coverImage} alt={blog.title} />
                    <div className="absolute top-0 left-0 m-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 bg-opacity-90 text-white">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <Link to={`/blogs/${blog.id}`} className="block mt-2">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-500 line-clamp-3">
                        {blog.summary}
                      </p>
                    </Link>
                    
                    {blog.tags && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map(tag => (
                          <span 
                            key={tag} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={blog.author.avatar || 'https://via.placeholder.com/40'} alt={blog.author.name} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {blog.author.name}
                      </p>
                      <div className="flex text-xs text-gray-500">
                        <time dateTime={blog.publishedAt}>
                          {formatDate(blog.publishedAt)}
                        </time>
                        <span className="mx-1">
                          &middot;
                        </span>
                        <span>
                          {blog.readTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Call to action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-10 sm:px-10 sm:py-12 md:py-16 lg:flex lg:items-center">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Want to contribute?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-indigo-100">
                Share your knowledge and insights with our community. Write a technical article or tutorial.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8 flex-shrink-0">
              <Link
                to="/blogs/create"
                className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
              >
                Start Writing
                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogList; 