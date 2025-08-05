import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';

const UserManagement = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const usersData = [];
            querySnapshot.forEach((doc) => {
                usersData.push({ id: doc.id, ...doc.data() });
            });
            setUsers(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        }
        setLoading(false);
    };

    const handleRoleChange = async (userId, newRole) => {
        if (userId === user.uid) {
            toast.error("You cannot change your own role");
            return;
        }

        if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
            const result = await userService.updateUserRole(userId, newRole);
            if (result.success) {
                toast.success('User role updated successfully');
                fetchUsers(); // Refresh the list
            } else {
                toast.error('Failed to update user role');
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
            <h1 className='text-2xl font-bold mb-6 text-gray-800'>User Management</h1>
            
            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-16 w-16 border-4 border-t-primary border-gray-200'></div>
                </div>
            ) : users.length > 0 ? (
                <div className='relative max-w-6xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide'>
                    <table className='w-full text-sm text-gray-500'>
                        <thead className='text-xs text-gray-700 text-left uppercase bg-gray-50'>
                            <tr>
                                <th scope='col' className='px-6 py-3'>#</th>
                                <th scope='col' className='px-6 py-3'>User</th>
                                <th scope='col' className='px-6 py-3'>Email</th>
                                <th scope='col' className='px-6 py-3'>Role</th>
                                <th scope='col' className='px-6 py-3'>Status</th>
                                <th scope='col' className='px-6 py-3 max-sm:hidden'>Joined</th>
                                <th scope='col' className='px-6 py-3'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((userData, index) => (
                                <tr key={userData.id} className='border-b border-gray-200 hover:bg-gray-50'>
                                    <td className='px-6 py-4'>{index + 1}</td>
                                    <td className='px-6 py-4'>
                                        <div className='flex items-center gap-2'>
                                            <img src={assets.user_icon} alt="" className='w-8 h-8' />
                                            <span className='font-medium'>{userData.displayName || 'User'}</span>
                                        </div>
                                    </td>
                                    <td className='px-6 py-4'>{userData.email}</td>
                                    <td className='px-6 py-4'>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            userData.role === 'admin' 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {userData.role || 'user'}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            userData.isActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {userData.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 max-sm:hidden text-xs'>
                                        {userData.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className='px-6 py-4'>
                                        {userData.id !== user.uid && (
                                            <select
                                                value={userData.role || 'user'}
                                                onChange={(e) => handleRoleChange(userData.id, e.target.value)}
                                                className='text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary'
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        )}
                                        {userData.id === user.uid && (
                                            <span className='text-xs text-gray-400'>Current User</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className='bg-white rounded-lg shadow p-8 text-center'>
                    <p className='text-gray-500'>No users found.</p>
                </div>
            )}
        </div>
    );
};

export default UserManagement;