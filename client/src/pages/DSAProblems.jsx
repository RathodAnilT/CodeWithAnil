import React from 'react';
import ProblemList from '../components/ProblemList';

const DSAProblems = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">DSA Problems</h1>
          <p className="mt-2 text-lg text-gray-600">
            Select a topic to view problem sets. Each topic contains up to 45 problems.
          </p>
        </div>
        
        <ProblemList />
      </div>
    </div>
  );
};

export default DSAProblems; 