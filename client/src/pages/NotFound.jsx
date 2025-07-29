import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4 py-12">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-extrabold text-primary-600 tracking-widest">404</h1>
        <span className="bg-primary-600 px-2 text-sm rounded-md text-white inline-block mt-4">
          Page Not Found
        </span>
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Oops! The page you're looking for doesn't exist.
          </h2>
          <p className="text-secondary-600 mb-8">
            The page might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link
            to="/"
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound; 