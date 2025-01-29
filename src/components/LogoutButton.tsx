import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LockClosedIcon } from "@heroicons/react/24/outline";

export const LogoutButton = () => {
  const { logout } = useAuth();
  
  return (
    <Button
      variant="ghost"
      onClick={logout}
      className="text-red-400 hover:bg-red-400/10 hover:text-red-500"
    >
      <LockClosedIcon className="h-4 w-4 mr-2" />
      Lock System
    </Button>
  );
}; 