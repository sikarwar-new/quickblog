import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { userService } from './userService';

// Blog CRUD operations
export const blogService = {
  // Create a new blog
  async createBlog(blogData, userId) {
    try {
      const docRef = await addDoc(collection(db, 'blogs'), {
        ...blogData,
        authorId: userId,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error creating blog:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all blogs
  async getBlogs() {
    try {
      const q = query(collection(db, 'blogs'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const blogs = [];
      querySnapshot.forEach((doc) => {
        blogs.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, blogs };
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return { success: false, error: error.message };
    }
  },

  // Get blogs with real-time updates
  subscribeToBlogsRealtime(callback) {
    const q = query(collection(db, 'blogs'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
      const blogs = [];
      querySnapshot.forEach((doc) => {
        blogs.push({ id: doc.id, ...doc.data() });
      });
      callback(blogs);
    });
  },

  // Get single blog by ID
  async getBlogById(id) {
    try {
      const docRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, blog: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, error: 'Blog not found' };
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete blog
  async deleteBlog(id, userId) {
    try {
      // Get the blog to check ownership
      const blogResult = await this.getBlogById(id);
      if (!blogResult.success) {
        return { success: false, error: 'Blog not found' };
      }

      // Check if user is the author or admin
      const isAdmin = await userService.isAdmin(userId);
      const isAuthor = blogResult.blog.authorId === userId;
      
      if (!isAuthor && !isAdmin) {
        return { success: false, error: 'Unauthorized: You can only delete your own blogs' };
      }

      await deleteDoc(doc(db, 'blogs', id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting blog:', error);
      return { success: false, error: error.message };
    }
  },

  // Update blog
  async updateBlog(id, blogData, userId) {
    try {
      // Get the blog to check ownership
      const blogResult = await this.getBlogById(id);
      if (!blogResult.success) {
        return { success: false, error: 'Blog not found' };
      }
      }

      // Check if user is the author or admin
      const isAdmin = await userService.isAdmin(userId);
      const isAuthor = blogResult.blog.authorId === userId;
      
      if (!isAuthor && !isAdmin) {
        return { success: false, error: 'Unauthorized: You can only edit your own blogs' };
      const docRef = doc(db, 'blogs', id);
      await updateDoc(docRef, {
        ...blogData,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating blog:', error);
      return { success: false, error: error.message };
    }
  }
};