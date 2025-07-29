import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to homepage and show a toast notification
    toast.info('Dashboard is currently under maintenance. Redirecting to homepage...', { 
      duration: 3000,
      id: 'dashboard-redirect'
    });
    
    // Redirect after a short delay
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 300);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  // Show a loading spinner during the short redirect delay
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}

export default Dashboard; 