
import { NavBar } from "@/components/NavBar";
import { Card } from "@/components/ui/card";
import { AdContainer } from "@/components/AdContainer";
import { UserProfile } from "@/components/profile/UserProfile";
import { hasUserIdentity } from "@/lib/user-identity";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const hasIdentity = hasUserIdentity();
  
  return (
    <div className="min-h-screen pb-20 pt-4">
      <div className="container max-w-lg px-4">
        <h1 className="text-2xl font-bold text-center mt-4 mb-6">
          Your Spiritual Identity
        </h1>
        
        <AdContainer position="top" />
        
        {hasIdentity ? (
          <UserProfile />
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
