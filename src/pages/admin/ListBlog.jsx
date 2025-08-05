import React, { useEffect, useState } from 'react';
import { blogService } from '../../services/blogService';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';

const ListBlog = () => {
    const { user } = useAuth();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBlogs = async () => {
        const result = await blogService.getBlogs();
        if (result.success) {
            setBlogs(result.blogs);
        } else {
            toast.error('Failed to fetch blogs');
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            const result = await blogService.deleteBlog(id, user.uid);
            if (result.success) {
                toast.success('Blog deleted successfully');
                fetchBlogs(); // Refresh the list
            } else {
                toast.error('Failed to delete blog');
            }
        }
    };

    const handleTogglePublish = async (id, currentStatus) => {
        const result = await blogService.updateBlog(id, { isPublished: !currentStatus }, user.uid);
        if (result.success) {
            toast.success(`Blog ${!currentStatus ? 'published' : 'unpublished'} successfully`);
            fetchBlogs(); // Refresh the list
        } else {
            toast.error('Failed to update blog status');
        }
    };
    useEffect(() => {
        fetchBlogs()
    }, []);

    return (
    <>
        <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
            <h1>All Blogs</h1>

            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-16 w-16 border-4 border-t-primary border-gray-200'></div>
                </div>
            ) : (
                <div className='relative h-4/5 mt-4 max-w-6xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
                    <table className='w-full text-sm text-gray-500'>
                        <thead className='text-xs text-gray-600 text-left uppercase bg-gray-50'>
                            <tr>
                                <th scope='col' className='px-4 py-3'>#</th>
                                <th scope='col' className='px-4 py-3'>Image</th>
                                <th scope='col' className='px-4 py-3'>Title</th>
                                <th scope='col' className='px-4 py-3'>Category</th>
                                <th scope='col' className='px-4 py-3 max-sm:hidden'>Date</th>
                                <th scope='col' className='px-4 py-3 max-sm:hidden'>Status</th>
                                <th scope='col' className='px-4 py-3'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog, index) => (
                                <tr key={blog.id} className='border-b border-gray-200 hover:bg-gray-50'>
                                    <td className='px-4 py-4'>{index + 1}</td>
                                    <td className='px-4 py-4'>
                                        <img 
                                            src={blog.imageURL} 
                                            alt={blog.title} 
                                            className='w-16 h-12 object-cover rounded'
                                        />
                                    </td>
                                    <td className='px-4 py-4 max-w-xs'>
                                        <div className='font-medium text-gray-900 truncate'>{blog.title}</div>
                                        <div className='text-gray-500 text-xs truncate'>{blog.subTitle}</div>
                                    </td>
                                    <td className='px-4 py-4'>
                                        <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>
                                            {blog.category}
                                        </span>
                                    </td>
                                    <td className='px-4 py-4 max-sm:hidden text-xs'>
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className='px-4 py-4 max-sm:hidden'>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            blog.isPublished 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {blog.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className='px-4 py-4'>
                                        <div className='flex items-center gap-2'>
                                            <button
                                                onClick={() => handleTogglePublish(blog.id, blog.isPublished)}
                                                className='text-xs px-3 py-1 border rounded hover:bg-gray-50 transition-all'
                                            >
                                                {blog.isPublished ? 'Unpublish' : 'Publish'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog.id)}
                                                className='text-red-600 hover:text-red-800 transition-all'
                                            >
                                                <img src={assets.cross_icon} alt="Delete" className='w-4 h-4' />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {!loading && blogs.length === 0 && (
                <div className='text-center py-20'>
                    <p className='text-gray-500 text-lg'>No blogs found. Create your first blog!</p>
                </div>
            )}
        </div>
    </>
)
}

export default ListBlog