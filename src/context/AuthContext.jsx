import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user profile in Firestore
      await userService.createUserProfile(result.user.uid, {
        email: result.user.email,
        displayName: result.user.displayName || email.split('@')[0]
      });
      
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Fetch user profile and check admin status
  const fetchUserProfile = async (user) => {
    if (user) {
      const result = await userService.getUserProfile(user.uid);
      if (result.success) {
        setUserProfile(result.user);
        setIsAdmin(result.user.role === 'admin');
      } else {
        // If profile doesn't exist, create it
        await userService.createUserProfile(user.uid, {
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0]
        });
        setUserProfile({ role: 'user', email: user.email });
        setIsAdmin(false);
      }
    } else {
      setUserProfile(null);
      setIsAdmin(false);
    }
  };
  // Listen for authentication state changes
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setUser(user);
    
    const handleUserProfile = async () => {
      await fetchUserProfile(user);
      setLoading(false);
    };

    handleUserProfile();
  });

  return unsubscribe;
}, []);


  const value = {
    user,
    userProfile,
    isAdmin,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
    refreshUserProfile: () => fetchUserProfile(user)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};