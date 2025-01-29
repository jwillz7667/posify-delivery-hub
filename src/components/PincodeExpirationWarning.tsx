import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export const PincodeExpirationWarning = ({ expiresAt }: { expiresAt: Date }) => {
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const calculateDays = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      setDaysRemaining(Math.ceil(diff / (1000 * 3600 * 24)));
    };
    
    calculateDays();
    const interval = setInterval(calculateDays, 3600000); // Update hourly
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (daysRemaining > pincodeConfig.warningDays) return null;

  return (
    <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
      <p>
        Your pincode expires in {daysRemaining} days. 
        <Button 
          variant="link" 
          className="text-yellow-700 hover:text-yellow-600"
          onClick={() => setShowModal(true)}
        >
          Update now
        </Button>
      </p>
      
      {/* Update Modal would go here */}
    </div>
  );
}; 