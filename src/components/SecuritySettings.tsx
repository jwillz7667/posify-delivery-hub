import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { PincodeExpirationWarning } from '@/components/PincodeExpirationWarning';
import { useAuth } from '../contexts/AuthContext';

export const SecuritySettings = () => {
  const [currentPincode, setCurrentPincode] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [expirationInfo, setExpirationInfo] = useState<{
    isExpired: boolean;
    expiresAt?: Date;
  }>();
  
  const { login } = useAuth();

  useEffect(() => {
    const loadStatus = async () => {
      const { data } = await api.get('/users/me/pincode-status');
      setExpirationInfo(data);
    };
    loadStatus();
  }, []);

  const handleUpdatePincode = async () => {
    try {
      await api.patch('/users/me/pincode', {
        currentPincode,
        newPincode
      });
      // Refresh user data
      const { data } = await api.get('/auth/me');
      login(data.access_token);
      setCurrentPincode('');
      setNewPincode('');
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="space-y-6">
      {expirationInfo?.isExpired && (
        <div className="bg-red-100 p-4 rounded-lg">
          Your pincode has expired. Please set a new one.
        </div>
      )}
      
      {expirationInfo?.expiresAt && (
        <PincodeExpirationWarning expiresAt={expirationInfo.expiresAt} />
      )}

      <Input
        type="password"
        placeholder="Current Pincode"
        value={currentPincode}
        onChange={(e) => setCurrentPincode(e.target.value)}
      />
      <Input
        type="password"
        placeholder="New Pincode (4 digits)"
        value={newPincode}
        onChange={(e) => setNewPincode(e.target.value)}
        maxLength={4}
      />
      <Button onClick={handleUpdatePincode}>
        Update Pincode
      </Button>
    </div>
  );
}; 