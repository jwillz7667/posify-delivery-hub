import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PincodeInput } from '../components/PincodeInput';
import { api } from '../lib/api';

const PincodeVerification = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (params.get('from') === 'logout') {
      localStorage.clear();
      window.history.replaceState({}, '', '/verify-pincode');
    }

    if (!localStorage.getItem('tempToken') && !user?.pincodeRequired) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleVerify = async (pincode: string) => {
    try {
      const { data } = await api.post('/auth/verify-pincode', { pincode });
      login(data.access_token);
      navigate('/');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <PincodeInput onVerify={handleVerify} />
    </div>
  );
};

export default PincodeVerification; 