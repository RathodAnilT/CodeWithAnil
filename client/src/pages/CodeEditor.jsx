import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';

function CodeEditor() {
  const [code, setCode] = useState('// Start coding here...');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [problem, setProblem] = useState(null);
  const { problemId } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProblem = async () => {
      if (!problemId) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`/api/problems/${problemId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProblem(response.data);
        
        // Set starter code if provided
        if (response.data.starterCode) {
          setCode(response.data.starterCode);
        }
        
        // Set language based on problem
        if (response.data.language) {
          setLanguage(response.data.language);
        }
      } catch (err) {
        console.error('Error fetching problem:', err);
      }
    };
    
    fetchProblem();
  }, [problemId, navigate]);
  
  const handleEditorChange = (value) => {
    setCode(value);
  };
  
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };
  
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };
  
  const runCode = async () => {
    setLoading(true);
    setOutput('Running code...');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post('/api/code/run', {
        code,
        language,
        problemId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setOutput(response.data.output);
    } catch (err) {
      setOutput(`Error: ${err.response?.data?.message || 'Failed to run code'}`);
    } finally {
      setLoading(false);
    }
  };
  
  const submitSolution = async () => {
    setLoading(true);
    setOutput('Submitting solution...');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.post(`/api/problems/${problemId}/submit`, {
        code,
        language
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOutput(`Success! All test cases passed.\n${response.data.message || ''}`);
      } else {
        setOutput(`Failed. ${response.data.message || 'Some test cases failed.'}\n${response.data.output || ''}`);
      }
    } catch (err) {
      setOutput(`Error: ${err.response?.data?.message || 'Failed to submit solution'}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-secondary-900 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Problem description panel */}
        <div className="w-full md:w-1/3 bg-secondary-800 text-white p-4 overflow-y-auto">
          {problem ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
              <div className="flex space-x-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  problem.difficulty === 'easy' ? 'bg-green-900 text-green-200' : 
                  problem.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-200' : 
                  'bg-red-900 text-red-200'
                }`}>
                  {problem.difficulty}
                </span>
                <span className="px-2 py-1 bg-secondary-700 rounded text-xs font-medium">
                  {problem.category}
                </span>
              </div>
              <div className="prose prose-sm prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: problem.description }}></div>
              </div>
              
              {problem.examples && problem.examples.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Examples:</h3>
                  {problem.examples.map((example, idx) => (
                    <div key={idx} className="mb-4 p-3 bg-secondary-700 rounded">
                      <p className="text-sm font-medium mb-1">Input: <span className="font-mono">{example.input}</span></p>
                      <p className="text-sm font-medium mb-1">Output: <span className="font-mono">{example.output}</span></p>
                      {example.explanation && (
                        <p className="text-sm mt-2">Explanation: {example.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {problem.constraints && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Constraints:</h3>
                  <ul className="list-disc list-inside text-sm">
                    {problem.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        
        {/* Code editor panel */}
        <div className="w-full md:w-2/3 flex flex-col">
          <div className="bg-secondary-800 p-3 border-b border-secondary-700 flex flex-wrap justify-between items-center gap-3">
            <div className="flex space-x-3">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="bg-secondary-700 text-white px-3 py-1 rounded text-sm border border-secondary-600"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
              
              <select
                value={theme}
                onChange={handleThemeChange}
                className="bg-secondary-700 text-white px-3 py-1 rounded text-sm border border-secondary-600"
              >
                <option value="vs-dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={runCode}
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
              >
                Run Code
              </button>
              <button
                onClick={submitSolution}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <Editor
              height="100%"
              language={language}
              value={code}
              theme={theme}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono, monospace',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
          
          <div className="bg-secondary-800 text-white h-40 overflow-y-auto p-3 font-mono text-sm">
            <div className="border-b border-secondary-700 pb-1 mb-2 text-xs text-secondary-400">Console Output</div>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeEditor;