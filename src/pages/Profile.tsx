
import { NavBar } from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import { AdContainer } from "@/components/AdContainer";
import { UserProfile } from "@/components/profile/UserProfile";
import { hasUserIdentity } from "@/lib/user-identity";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const hasIdentity = hasUserIdentity();
  
  const handleLogout = () => {
    // Clear relevant local storage
    localStorage.removeItem('userIdentity');
    
    // Show toast notification
    toast.success("You have been logged out successfully");
    
    // Navigate back to home page
    navigate('/');
  };
  
  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="container max-w-lg px-4">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-auto"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-center mx-auto">
            Your Spiritual Identity
          </h1>
          <div className="mr-auto w-9"></div>
        </div>
        
        <AdContainer position="top" />
        
        {hasIdentity ? (
          <>
            <UserProfile />
            
            <div className="mt-6 flex justify-center">
              <Button 
                variant="destructive"
                className="flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </>
        ) : (
          <Card className="p-6 text-center">
            <h3 className="text-lg font-medium mb-3">Create Your Spiritual Identity</h3>
            <p className="mb-4 text-muted-foreground">
              You haven't created a spiritual identity yet. Creating an identity allows you to
              transfer your journey to other devices and keep track of your progress.
            </p>
            <Button onClick={() => navigate("/welcome")}>Create Identity</Button>
          </Card>
        )}
        
        <AdContainer position="bottom" />
      </div>
      
      <NavBar />
    </div>
  );
};

export default Profile;
