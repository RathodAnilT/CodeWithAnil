import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/API';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { SDE_SHEET_PATHS } from '../utils/apiPaths';

// Color mappings for difficulty
const DIFFICULTY_COLORS = {
  Easy: {
    bg: 'bg-green-900',
    text: 'text-green-200',
    lighter: 'bg-green-800',
    progress: 'bg-green-500'
  },
  Medium: {
    bg: 'bg-yellow-900',
    text: 'text-yellow-200',
    lighter: 'bg-yellow-800',
    progress: 'bg-yellow-500'
  },
  Hard: {
    bg: 'bg-red-900',
    text: 'text-red-200',
    lighter: 'bg-red-800',
    progress: 'bg-red-500'
  }
};

function SDESheet() {
  const [problems, setProblems] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingProblem, setUpdatingProblem] = useState(null);
  const [pulseProblemId, setPulseProblemId] = useState(null);
  
  // Default statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    solved: 0,
    inProgress: 0,
    completion: 0,
    byDifficulty: {
      Easy: { total: 0, solved: 0 },
      Medium: { total: 0, solved: 0 },
      Hard: { total: 0, solved: 0 }
    }
  });
  
  // Authentication and user management
  const { currentUser, isAuthenticated, refreshToken } = useAuth();
  const navigate = useNavigate();
  
  // DEBUG INFO - Display at top of component
  useEffect(() => {
    if (problems.length > 0) {
      console.log('🚨 TOTAL PROBLEMS LOADED:', problems.length);
      
      // Log count by section
      const sectionCounts = problems.reduce((acc, problem) => {
        const section = problem.section || 'Uncategorized';
        acc[section] = (acc[section] || 0) + 1;
        return acc;
      }, {});
      
      console.table(sectionCounts);
    }
  }, [problems]);
  
  // Memoize the fetchProblems function to prevent unnecessary re-renders
  const fetchProblems = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Starting to fetch problems from API...');
      
      // Direct fetch to avoid issues with the API wrapper
      let problemsData = null;
      
      // Try all possible API endpoints to get the data
      const endpoints = [
        '/api/sde-sheet/problems',
        '/sde-sheet/problems',
        '/api/sde-sheet/problems?sheet=sde'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Trying endpoint: ${endpoint}`);
          const response = await fetch(endpoint);
          
          // Check if response is valid JSON
          const contentType = response.headers.get('content-type');
          if (!response.ok || !contentType || !contentType.includes('application/json')) {
            console.log(`❌ Response not valid JSON. Status: ${response.status}, Content-Type: ${contentType}`);
            continue; // Try next endpoint
          }
          
          // Parse the response
          const data = await response.json();
          console.log(`✅ Response from ${endpoint}:`, data);
          
          let extractedProblems = null;
          
          // Handle different response formats
          if (Array.isArray(data) && data.length > 0) {
            // Direct array format
            extractedProblems = data;
          } else if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
            // { data: [...] } format
            extractedProblems = data.data;
          } else if (data && data.problems && Array.isArray(data.problems) && data.problems.length > 0) {
            // { problems: [...] } format
            extractedProblems = data.problems;
          }
          
          if (extractedProblems && extractedProblems.length > 0) {
            problemsData = extractedProblems;
            console.log(`✅ Found ${extractedProblems.length} problems from ${endpoint}`);
            break; // Successfully got data, exit the loop
          }
        } catch (error) {
          console.error(`❌ Error with endpoint ${endpoint}:`, error.message);
          // Continue to next endpoint
        }
      }
      
      // If we found problems, update state
      if (problemsData && problemsData.length > 0) {
        console.log(`🎉 Successfully loaded ${problemsData.length} problems!`);
        
        // Ensure all problems have the required fields
        const validatedProblems = problemsData.map(p => ({
          _id: p._id || `temp-${Math.random().toString(36).substring(2, 9)}`,
          title: p.title || 'Untitled Problem',
          difficulty: p.difficulty || 'Medium',
          section: p.section || p.category || 'Uncategorized',
          leetCodeLink: p.leetCodeLink || p.link || '',
          status: p.status || 'unsolved',
          bookmarked: !!p.bookmarked,
          order: p.order || 0
        }));
        
        console.log(`✅ Validated ${validatedProblems.length} problems`);
        
        // Set problems in state
        setProblems(validatedProblems);
        
        // Extract unique sections
        const uniqueSections = [...new Set(validatedProblems.map(p => p.section).filter(Boolean))];
        console.log('📋 Found sections:', uniqueSections);
        setSections(uniqueSections);
        
        toast.success(`Loaded ${validatedProblems.length} problems`);
      } else {
        // If no problems found, use sample problems
        console.warn('⚠️ No problems found from API, showing empty state');
        setProblems([]);
        setSections([]);
        setError('Failed to load problems from the server. No problems found.');
        toast.error('No problems found in the API');
      }
    } catch (error) {
      console.error('❌ Unexpected error in fetchProblems:', error);
      setError('An unexpected error occurred while fetching problems.');
      setProblems([]);
      setSections([]);
      toast.error('Error loading problems.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch problems when component mounts
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);
  
  // Convert problems array to grouped by section
  const problemsBySection = useMemo(() => {
    const grouped = problems.reduce((acc, problem) => {
      const section = problem.section || 'Uncategorized';
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(problem);
      return acc;
    }, {});

    console.log('🗂️ Problems grouped by section:', Object.keys(grouped).map(section => ({
      section,
      count: grouped[section].length
    })));
    
    return grouped;
  }, [problems]);

  // Filter and organize problems into sections
  const getFilteredSections = useCallback(() => {
    console.log('🔍 Starting filtering with', problems.length, 'problems');
    
    // Early return if no problems
    if (!problems.length) {
      console.log('❌ No problems to filter');
      return {};
    }
    
    // Filter for all problems based on selected criteria
    const filtered = {};
    
    problems.forEach(problem => {
      // Skip if problem doesn't have a section (should not happen, but just in case)
      if (!problem.section) {
        console.warn('⚠️ Problem missing section:', problem.title);
        return;
      }
      
      // Check if problem matches selected filters
      const matchesDifficulty = selectedDifficulty === 'all' || 
        problem.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
        
      const matchesSection = selectedSection === 'all' || 
        problem.section.toLowerCase() === selectedSection.toLowerCase();
        
      const matchesSearch = !searchQuery || 
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (problem.description && problem.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (matchesDifficulty && matchesSection && matchesSearch) {
        // Create section array if it doesn't exist
        if (!filtered[problem.section]) {
          filtered[problem.section] = [];
        }
        
        // Add problem to its section
        filtered[problem.section].push(problem);
      }
    });
    
    // Sort problems within each section
    Object.keys(filtered).forEach(section => {
      filtered[section].sort((a, b) => {
        // Sort by order if available
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        // Otherwise sort by title
        return a.title.localeCompare(b.title);
      });
    });
    
    console.log('📊 Final filtered sections:', Object.keys(filtered).length);
    console.log('🔢 Total problems after filtering:', 
      Object.values(filtered).reduce((sum, problems) => sum + problems.length, 0)
    );
    
    return filtered;
  }, [problems, selectedDifficulty, selectedSection, searchQuery]);

  // Memoize filtered sections
  const filteredSections = useMemo(() => getFilteredSections(), [getFilteredSections]);
  
  // Update problem status with proper authentication handling
  const updateProblemStatus = useCallback(async (problemId, newStatus) => {
    try {
      setUpdatingProblem(problemId);
      
      // Get the problem that was updated
      const updatedProblem = problems.find(p => p._id === problemId);
      if (!updatedProblem) return;
      
      // Update the problem in local state
      setProblems(prevProblems => 
        prevProblems.map(problem => 
          problem._id === problemId ? { ...problem, status: newStatus } : problem
        )
      );
      
      toast.success(`Problem marked as ${newStatus}`);
    } catch (error) {
      console.error('Failed to update problem status:', error);
      toast.error('Failed to update problem status');
    } finally {
      setUpdatingProblem(null);
    }
  }, [problems]);
  
  // Toggle checkbox status
  const toggleCheckbox = useCallback((problemId) => {
    const problem = problems.find(p => p._id === problemId);
    if (!problem) return;
    
    const newStatus = problem.status === 'solved' ? 'unsolved' : 'solved';
    updateProblemStatus(problemId, newStatus);
  }, [problems, updateProblemStatus]);
  
  // Toggle bookmark with auth handling
  const toggleBookmark = useCallback(async (problemId) => {
    if (!isAuthenticated || !currentUser) {
      toast.error('Please log in to bookmark problems');
      return;
    }
    
    // Optimistically update UI
    setProblems(prevProblems => 
      prevProblems.map(problem => 
        problem._id === problemId 
          ? { ...problem, bookmarked: !problem.bookmarked } 
          : problem
      )
    );
    
    toast.success('Bookmark updated');
  }, [currentUser, isAuthenticated]);

  // Get the number of problems for each difficulty
  const getDifficultyStats = (problems) => {
    return problems.reduce(
      (stats, problem) => {
        if (problem.difficulty === 'Easy') stats.easy++;
        else if (problem.difficulty === 'Medium') stats.medium++;
        else if (problem.difficulty === 'Hard') stats.hard++;
        stats.total++;
        return stats;
      },
      { easy: 0, medium: 0, hard: 0, total: 0 }
    );
  };
  
  // Calculate section statistics
  const sectionStats = useMemo(() => {
    const stats = {};
    
    Object.entries(filteredSections).forEach(([section, sectionProblems]) => {
      stats[section] = getDifficultyStats(sectionProblems);
    });
    
    console.log('📊 Section stats:', stats);
    return stats;
  }, [filteredSections]);
  
  // Sort sections alphabetically for consistent display
  const sortedSectionNames = useMemo(() => {
    const result = Object.keys(filteredSections).sort();
    console.log('📋 Sorted sections:', result);
    return result;
  }, [filteredSections]);

  return (
    <div className="min-h-screen bg-gray-900 pb-12">
      {/* Fixed header with filters */}
      <div className="bg-gray-800 sticky top-0 z-10 border-b border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-white">SDE Sheet</h1>
              
              {/* Filters and controls in one row */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                {/* Topic dropdown */}
                <div className="w-full sm:w-auto">
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  >
                    <option value="all">All Topics</option>
                    {sections.map(section => (
                      <option key={section} value={section}>{section}</option>
                    ))}
                  </select>
                </div>
                
                {/* Difficulty dropdown */}
                <div className="w-full sm:w-auto">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-gray-700 border border-gray-600 text-white text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="Easy" className="text-green-400">Easy</option>
                    <option value="Medium" className="text-yellow-400">Medium</option>
                    <option value="Hard" className="text-red-400">Hard</option>
                  </select>
                </div>
                
                {/* Search input */}
                <div className="w-full sm:w-auto relative flex-grow max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-700 border border-gray-600 pl-10 pr-3 py-2 w-full rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                {/* Refresh button */}
                <button
                  onClick={() => fetchProblems()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center space-x-1 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                  <h2 className="text-lg font-medium text-white">Stats</h2>
                </div>
                <div className="p-4 space-y-4">
                  {/* Difficulty stats here */}
                  <div>
                    <div className="text-white font-medium mb-2">Problem Stats</div>
                    <div className="text-gray-300">
                      Total Problems: {problems.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Problems Content */}
          <div className="lg:w-3/4">
            {/* Loading state */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <span className="ml-3 text-white">Loading problems...</span>
              </div>
            ) : error ? (
              <div className="bg-red-900 border border-red-800 text-red-100 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p>{error}</p>
                </div>
                <div className="mt-3">
                  <button 
                    onClick={() => fetchProblems()}
                    className="text-red-100 underline hover:text-white"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Show by sections */}
                {sortedSectionNames.length === 0 ? (
                  <div className="bg-gray-800 rounded-lg shadow-md p-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-white">No problems found</h3>
                    <p className="mt-2 text-gray-400">Try changing your filters or search query.</p>
                    <button 
                      onClick={() => {
                        setSelectedSection('all');
                        setSelectedDifficulty('all');
                        setSearchQuery('');
                        fetchProblems();
                      }}
                      className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  sortedSectionNames.map((section) => {
                    const sectionProblems = filteredSections[section];
                    return (
                      <div key={section} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        {/* Section header */}
                        <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
                          <h2 className="text-lg font-medium text-white flex items-center">
                            {section}
                            <span className="ml-2 text-sm bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                              {sectionProblems.length} problems
                            </span>
                          </h2>
                        </div>
                        
                        {/* Problems table */}
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-16">
                                  Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                  Problem
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-purple-400 uppercase tracking-wider w-24">
                                  Difficulty
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {sectionProblems.map((problem, index) => (
                                <tr 
                                  key={problem._id || index} 
                                  className={`${
                                    index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'
                                  } hover:bg-gray-700 transition-colors`}
                                >
                                  {/* Status checkbox */}
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center">
                                      <input
                                        type="checkbox"
                                        checked={problem.status === 'solved'}
                                        onChange={() => toggleCheckbox(problem._id)}
                                        disabled={!currentUser}
                                        className={`h-5 w-5 rounded ${
                                          problem.status === 'solved' 
                                            ? 'text-green-500 bg-green-900 border-green-700' 
                                            : 'text-gray-400 bg-gray-700 border-gray-600'
                                        } focus:ring-offset-gray-800 focus:ring-2 focus:ring-indigo-500`}
                                      />
                                    </div>
                                  </td>
                                  
                                  {/* Problem title */}
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <a 
                                      href={problem.leetCodeLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-white hover:text-indigo-300 transition-colors"
                                    >
                                      {problem.title}
                                      {problem.leetCodeLink && (
                                        <span className="inline-block ml-2">
                                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                          </svg>
                                        </span>
                                      )}
                                    </a>
                                  </td>
                                  
                                  {/* Difficulty */}
                                  <td className="px-4 py-4 whitespace-nowrap text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[problem.difficulty]?.text} ${DIFFICULTY_COLORS[problem.difficulty]?.bg}`}>
                                      {problem.difficulty}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SDESheet; 