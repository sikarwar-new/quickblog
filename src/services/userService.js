import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const userService = {
  // Create user profile with role
  async createUserProfile(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...userData,
        role: 'user', // Default role
        createdAt: serverTimestamp(),
        isActive: true
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user profile and role
  async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { success: true, user: userSnap.data() };
      } else {
        return { success: false, error: 'User profile not found' };
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { success: false, error: error.message };
    }
  },

  // Update user role (admin only)
  async updateUserRole(userId, role) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        role,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if user is admin
  async isAdmin(userId) {
    try {
      const result = await this.getUserProfile(userId);
      if (result.success) {
        return result.user.role === 'admin';
      }
      return false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
};