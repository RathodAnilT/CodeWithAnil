import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactCalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip } from 'react-tooltip';

function DSATracker() {
  const [problems, setProblems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState([]);
  
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await axios.get('/api/problems', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Make sure problems exists and is an array before setting state
        const problemsData = response.data?.problems || [];
        setProblems(problemsData);
        
        // Extract unique categories safely
        const uniqueCategories = problemsData && problemsData.length > 0
          ? [...new Set(problemsData.map(p => p.category))]
          : [];
        setCategories(uniqueCategories);
        
        // Generate activity data for heatmap safely
        const activityData = response.data?.userProgress
          ? response.data.userProgress.map(progress => ({
              date: progress.date,
              count: progress.problemsCompleted
            }))
          : [];
        
        setActivityData(activityData);
      } catch (err) {
        console.error('Error fetching problems:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const filteredProblems = problems.filter(problem => {
    const categoryMatch = selectedCategory === 'all' || problem.category === selectedCategory;
    const difficultyMatch = difficulty === 'all' || problem.difficulty === difficulty;
    const statusMatch = status === 'all' || problem.status === status;
    return categoryMatch && difficultyMatch && statusMatch;
  });

  const markProblemAsSolved = async (problemId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      await axios.post(`/api/problems/${problemId}/solve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setProblems(problems.map(p => 
        p.id === problemId ? { ...p, status: 'solved' } : p
      ));
    } catch (err) {
      console.error('Error marking problem as solved:', err);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-secondary-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold text-secondary-900">DSA Problem Tracker</h2>
            <p className="mt-1 max-w-2xl text-sm text-secondary-500">
              Track your progress on data structures and algorithms problems
            </p>
          </div>
          
          <div className="border-t border-secondary-200 p-4">
            <h3 className="text-lg font-medium text-secondary-900 mb-3">Your Activity</h3>
            <div className="bg-white p-4 rounded-lg border border-secondary-200">
              <ReactCalendarHeatmap
                startDate={new Date(new Date().getFullYear(), 0, 1)}
                endDate={new Date(new Date().getFullYear(), 11, 31)}
                values={activityData}
                classForValue={(value) => {
                  if (!value || value.count === 0) return 'color-empty';
                  if (value.count < 3) return 'color-scale-1';
                  if (value.count < 5) return 'color-scale-2';
                  return 'color-scale-3';
                }}
                tooltipDataAttrs={(value) => {
                  if (!value || !value.date) return null;
                  return {
                    'data-tooltip-id': 'calendar-tooltip',
                    'data-tooltip-content': `${value.date}: ${value.count || 0} problems solved`
                  };
                }}
              />
              <Tooltip id="calendar-tooltip" />
              <style>
                {`
                .color-empty { fill: #ebedf0; }
                .color-scale-1 { fill: #c6e48b; }
                .color-scale-2 { fill: #7bc96f; }
                .color-scale-3 { fill: #239a3b; }
                `}
              </style>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-secondary-200">
            <h3 className="text-lg font-medium text-secondary-900">Problem List</h3>
          </div>
          
          <div className="p-4">
            <div className="flex flex-wrap gap-4 mb-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-secondary-700">Category</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-secondary-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-secondary-700">Difficulty</label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-secondary-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-secondary-700">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-secondary-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Status</option>
                  <option value="solved">Solved</option>
                  <option value="attempted">Attempted</option>
                  <option value="unsolved">Unsolved</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200">
                  <thead className="bg-secondary-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Problem</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Category</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Difficulty</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-secondary-200">
                    {filteredProblems.length > 0 ? (
                      filteredProblems.map((problem) => (
                        <tr key={problem.id} className="hover:bg-secondary-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-primary-600">
                              <a href={`/problem/${problem.id}`} className="hover:underline">{problem.title}</a>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-secondary-900">{problem.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              problem.status === 'solved' 
                                ? 'bg-green-100 text-green-800' 
                                : problem.status === 'attempted' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-secondary-100 text-secondary-800'
                            }`}>
                              {problem.status === 'solved' ? 'Solved' : problem.status === 'attempted' ? 'Attempted' : 'Unsolved'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                            <button 
                              onClick={() => markProblemAsSolved(problem.id)}
                              className={`text-primary-600 hover:text-primary-900 ${problem.status === 'solved' ? 'opacity-50 cursor-default' : ''}`}
                              disabled={problem.status === 'solved'}
                            >
                              {problem.status === 'solved' ? 'Solved' : 'Mark as Solved'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-secondary-500">
                          No problems found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DSATracker; 