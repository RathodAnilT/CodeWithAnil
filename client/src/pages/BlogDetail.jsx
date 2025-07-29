import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../utils/axiosConfig';
import useAuth from '../hooks/useAuth';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import format from 'date-fns/format';
import { BLOG_PATHS } from '../utils/apiPaths';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const blog = await API.get(BLOG_PATHS.SINGLE(id));
        setBlog(blog);
        
        // After getting blog, fetch related blogs
        if (blog && blog.category) {
          try {
            const relatedBlogs = await API.get(`/api/blogs?category=${blog.category}&limit=3&excludeId=${id}`);
            setRelatedBlogs(relatedBlogs || sampleRelatedBlogs);
          } catch (err) {
            console.error('Failed to fetch related blogs:', err);
            setRelatedBlogs(sampleRelatedBlogs);
          }
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog. Please try again later.');
        setBlog(sampleBlog);
        setRelatedBlogs(sampleRelatedBlogs);
      } finally {
        setLoading(false);
      }
    };
    
    window.scrollTo(0, 0);
    fetchBlog();
  }, [id]);
  
  // Sample blog data for development
  const sampleBlog = {
    id: 1,
    title: "Mastering Array Techniques for Coding Interviews",
    summary: "Learn essential array manipulation techniques that will help you solve problems efficiently in coding interviews.",
    content: `
      <h2>Introduction to Array Techniques</h2>
      <p>Arrays are one of the most fundamental data structures in computer science, and mastering them is crucial for success in coding interviews. In this article, we'll explore some essential array techniques that come up frequently in technical interviews.</p>
      
      <h2>1. Two Pointer Technique</h2>
      <p>The two-pointer technique is a pattern where two pointers iterate through the data structure in tandem until one or both of them hit a certain condition.</p>
      
      <pre><code>function twoSum(nums, target) {
    // Sort the array first (if not already sorted)
    nums.sort((a, b) => a - b);
    
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const sum = nums[left] + nums[right];
        
        if (sum === target) {
            return [left, right];
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [-1, -1]; // No solution found
}</code></pre>
      
      <h2>2. Sliding Window</h2>
      <p>The sliding window technique is used to perform a required operation on a specific window size of a given array or string.</p>
      
      <pre><code>function maxSubArraySum(arr, size) {
    if (size > arr.length) {
        return null;
    }
    
    let maxSum = 0;
    let tempSum = 0;
    
    // Calculate sum of first window
    for (let i = 0; i < size; i++) {
        maxSum += arr[i];
    }
    
    tempSum = maxSum;
    
    // Slide the window and calculate sums
    for (let i = size; i < arr.length; i++) {
        tempSum = tempSum - arr[i - size] + arr[i];
        maxSum = Math.max(maxSum, tempSum);
    }
    
    return maxSum;
}</code></pre>
      
      <h2>3. Binary Search</h2>
      <p>Binary search is an efficient algorithm for finding an item from a sorted array by repeatedly dividing the search interval in half.</p>
      
      <pre><code>function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Target not found
}</code></pre>
      
      <h2>Conclusion</h2>
      <p>These techniques form the foundation of many algorithm solutions in coding interviews. By mastering them, you'll be well-equipped to tackle a wide range of problems. Remember that practice is key - try implementing these patterns in different problem contexts to solidify your understanding.</p>
    `,
    category: "DSA",
    tags: ["Arrays", "Algorithms", "Interview Prep"],
    coverImage: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    publishedAt: "2023-09-15T10:00:00Z",
    readTime: 8,
    author: {
      name: "Anil Rathod",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      bio: "Software engineer specializing in algorithms and data structures. LeetCode enthusiast and technical interviewer."
    }
  };
  
  // Sample related blogs
  const sampleRelatedBlogs = [
    {
      id: 2,
      title: "Dynamic Programming for Interview Success",
      summary: "Master the art of breaking down complex problems into simpler subproblems.",
      category: "DSA",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      publishedAt: "2023-09-10T09:15:00Z",
      readTime: 12
    },
    {
      id: 3,
      title: "Graph Algorithms Every Programmer Should Know",
      summary: "Explore essential graph algorithms that frequently appear in technical interviews.",
      category: "DSA",
      coverImage: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      publishedAt: "2023-09-05T11:30:00Z",
      readTime: 10
    },
    {
      id: 4,
      title: "Optimizing Your Approach to Coding Challenges",
      summary: "Strategies for efficiently solving algorithmic problems under time pressure.",
      category: "DSA",
      coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      publishedAt: "2023-08-28T10:45:00Z",
      readTime: 7
    }
  ];
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  const isOwner = currentUser && blog && currentUser.id === blog.author?.id;
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!blog && error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">Error Loading Blog</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with blog image */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
        {blog.coverImage && (
          <div className="absolute inset-0 opacity-40">
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {blog.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white mb-4">
                {blog.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              {blog.title}
            </h1>
            
            <div className="flex items-center">
              <img 
                src={blog.author?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                alt={blog.author?.name || 'Author'} 
                className="h-10 w-10 rounded-full object-cover border-2 border-white"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {blog.author?.name || 'Anonymous Author'}
                </p>
                <div className="flex text-xs text-gray-300">
                  <time dateTime={blog.publishedAt}>
                    {formatDate(blog.publishedAt)}
                  </time>
                  <span className="mx-1">
                    &middot;
                  </span>
                  <span>
                    {blog.readTime || 5} min read
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-12">
          {/* Main content */}
          <motion.div 
            className="lg:col-span-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {blog.summary && (
              <div className="text-xl text-gray-700 mb-8 font-light italic leading-relaxed">
                {blog.summary}
              </div>
            )}
            
            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {blog.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Blog content */}
            <div 
              className="prose prose-blue prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content || '') }}
            />
            
            {/* Author bio */}
            {blog.author && (
              <div className="mt-12 border-t border-gray-200 pt-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start">
                  <img 
                    src={blog.author.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                    alt={blog.author.name} 
                    className="h-16 w-16 rounded-full object-cover mb-4 sm:mb-0"
                  />
                  <div className="sm:ml-6 text-center sm:text-left">
                    <h3 className="text-lg font-medium text-gray-900">About {blog.author.name}</h3>
                    <p className="mt-2 text-gray-600">
                      {blog.author.bio || 'Technical writer and software engineer passionate about sharing knowledge.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Actions for owner */}
            {isOwner && (
              <div className="flex space-x-4 mt-8">
                <Link
                  to={`/blogs/edit/${blog.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  Edit Article
                </Link>
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            )}
          </motion.div>
          
          {/* Sidebar */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Related articles */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Related Articles</h3>
              <div className="space-y-6">
                {relatedBlogs.length > 0 ? (
                  relatedBlogs.map(relatedBlog => (
                    <Link 
                      key={relatedBlog.id} 
                      to={`/blogs/${relatedBlog.id}`}
                      className="block group"
                    >
                      <div className="flex items-start">
                        {relatedBlog.coverImage && (
                          <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden mr-4">
                            <img 
                              src={relatedBlog.coverImage} 
                              alt={relatedBlog.title} 
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                            {relatedBlog.title}
                          </h4>
                          <div className="mt-1 text-xs text-gray-500">
                            {formatDate(relatedBlog.publishedAt)}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No related articles found.</p>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link 
                  to="/blogs" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  View all articles
                  <span className="ml-1" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
            
            {/* Newsletter signup */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-lg font-medium mb-3">Stay updated</h3>
              <p className="text-blue-100 text-sm mb-4">
                Get notified when we publish new content like this.
              </p>
              <form className="space-y-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-3 py-2 rounded-md text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-4 py-2 rounded-md bg-white text-blue-600 hover:bg-blue-50 font-medium text-sm transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Next/Prev navigation */}
      <div className="mt-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between">
            <Link
              to="/blogs"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <svg className="mr-2 -ml-1 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Articles
            </Link>
            
            <div className="flex space-x-3">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <svg className="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail; 