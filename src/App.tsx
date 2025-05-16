
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Manual from "./pages/Manual";
import Audio from "./pages/Audio";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Challenges from "./pages/Challenges";
import Profile from "./pages/Profile";
import WelcomeFlow from "./components/welcome/WelcomeFlow";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./components/theme-provider";
import { initializeNotificationSystem } from "./lib/notification-system";
import { soundPlayer } from "./lib/sound-system";
import { ThemeToggleButton } from "./components/ThemeToggleButton";
import { DailyPermissionPopup } from "./components/notifications/DailyPermissionPopup";

const queryClient = new QueryClient();

const App = () => {
  // Initialize notification system and sounds
  useEffect(() => {
    initializeNotificationSystem();
    soundPlayer.initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="mantra-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<>
                <ThemeToggleButton />
                <Index />
              </>} />
              <Route path="/manual" element={<Manual />} />
              <Route path="/audio" element={<Audio />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/welcome" element={<WelcomeFlow />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <DailyPermissionPopup />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
