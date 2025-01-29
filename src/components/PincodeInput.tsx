import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PincodeInputProps {
  onVerify: (pincode: string) => void;
  error?: string;
}

export const PincodeInput = ({ onVerify, error }: PincodeInputProps) => {
  const [pincode, setPincode] = useState('');

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 className="text-xl font-semibold">Enter Your Pincode</h2>
      <Input
        type="password"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
        placeholder="••••"
        className="text-center text-2xl h-12 w-32"
        maxLength={4}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button 
        onClick={() => onVerify(pincode)}
        className="w-full"
      >
        Verify
      </Button>
    </div>
  );
}; 