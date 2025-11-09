import React, { useEffect, useState } from 'react';
import { Planner } from './components/Planner';
import { AuthScreen } from './components/AuthScreen';
import { User, saveCurrentUser, getCurrentUser } from './utils/auth';
export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);
  const handleLogin = (user: User) => {
    saveCurrentUser(user);
    setCurrentUser(user);
  };
  const handleLogout = () => {
    setCurrentUser(null);
  };
  if (isLoading) {
    return <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>;
  }
  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }
  return <div className="w-full min-h-screen bg-gray-50">
      <Planner user={currentUser} onLogout={handleLogout} />
    </div>;
}