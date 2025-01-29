import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const [pincode, setPincode] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNumberClick = (number: number) => {
    if (pincode.length < 4) {
      setPincode(prev => prev + number);
    }
  };

  const handleClear = () => {
    setPincode('');
  };

  const handleDelete = () => {
    setPincode(prev => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pincode.length === 4) {
      try {
        const success = await login(pincode);
        if (success) {
          toast({
            title: "Login successful",
            description: "Welcome back!",
          });
          navigate('/');  // Redirect to dashboard
        } else {
          toast({
            title: "Invalid PIN",
            description: "Please try again",
            variant: "destructive",
          });
          setPincode('');
        }
      } catch (error) {
        console.error('Login failed:', error);
        toast({
          title: "Login failed",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
        setPincode('');
      }
    }
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pincode.length === 4) {
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-secondary" onKeyDown={handleKeyPress}>
      <Card className="w-[350px]">
        <CardHeader className="text-center">
          <CardTitle>Enter PIN</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-center">
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    i < pincode.length ? 'bg-accent' : 'bg-accent/20'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <Button
                key={number}
                variant="outline"
                className="h-14 text-xl font-semibold"
                onClick={() => handleNumberClick(number)}
              >
                {number}
              </Button>
            ))}
            <Button
              variant="outline"
              className="h-14 text-xl font-semibold"
              onClick={handleClear}
            >
              C
            </Button>
            <Button
              variant="outline"
              className="h-14 text-xl font-semibold"
              onClick={() => handleNumberClick(0)}
            >
              0
            </Button>
            <Button
              variant="outline"
              className="h-14 text-xl font-semibold"
              onClick={handleDelete}
            >
              ←
            </Button>
          </div>

          <Button 
            className="w-full mt-4" 
            onClick={handleSubmit}
            disabled={pincode.length !== 4}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login; 