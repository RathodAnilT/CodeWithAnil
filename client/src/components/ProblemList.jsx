import React, { useState, useEffect } from 'react';
import axios from 'axios';

const topics = [
  'Arrays', 'Strings', 'Linked List', 'Stack', 'Queue', 'Binary Tree', 'Binary Search Tree',
  'Heap', 'Recursion', 'Backtracking', 'Dynamic Programming', 'Greedy', 'Graphs',
  'Matrix', 'Searching', 'Sorting', 'Bit Manipulation', 'Two Pointers', 'Sliding Window',
  'Hash Table', 'Trie', 'Divide and Conquer', 'Math', 'Game Theory',
  'System Design', 'Object Oriented Design', 'Operating Systems', 'Database'
];

const ProblemList = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if a topic is selected
    if (selectedTopic) {
      fetchProblems(selectedTopic);
    }
  }, [selectedTopic]);

  const fetchProblems = async (topic) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching problems for topic: ${topic}`);
      const response = await axios.get(`/api/problems?topic=${topic}`);
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.success) {
        setProblems(response.data.data || []);
      } else {
        setError('Invalid response format from server');
        setProblems([]);
      }
    } catch (err) {
      console.error('Error fetching problems:', err);
      setError('Failed to fetch problems. Please try again later.');
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-yellow-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
          Select DSA Topic
        </label>
        <select
          id="topic"
          value={selectedTopic}
          onChange={handleTopicChange}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Select a topic</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-indigo-500">Loading problems...</span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && selectedTopic && problems.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">No problems found for topic "{selectedTopic}".</p>
            </div>
          </div>
        </div>
      )}

      {/* Problems list */}
      {!loading && !error && problems.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">{selectedTopic} Problems (showing {problems.length})</h2>
          <div className="bg-white shadow overflow-hidden rounded-md">
            <ul className="divide-y divide-gray-200">
              {problems.map((problem) => (
                <li key={problem._id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{problem.title}</h3>
                      <p className="text-sm text-gray-500">{problem.description?.substring(0, 150)}...</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      {problem.link && (
                        <a
                          href={problem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-sm text-indigo-600 hover:text-indigo-900"
                        >
                          Solve Problem
                        </a>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemList; 