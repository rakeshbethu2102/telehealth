import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      // Mock Bypass: If Firebase API key is missing, treat as authenticated via LocalStorage
      const isMockMode = !auth.config?.apiKey || auth.config?.apiKey === "YOUR_API_KEY";
      const storedRole = localStorage.getItem('userRole');
      const storedUserId = localStorage.getItem('userId');

      if (isMockMode && storedUserId && storedRole) {
        setUser({ uid: storedUserId, email: 'mock@example.com' });
        setUserRole(storedRole);
        setLoading(false);
        return;
      }

      if (firebaseUser) {
        setUser(firebaseUser);
        setUserRole(storedRole);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
