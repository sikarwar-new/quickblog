import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { blogService } from '../../services/blogService';
import { useAuth } from '../../context/AuthContext';

const DashBoard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        blogs: 0,
        published: 0,
        drafts: 0,
        myBlogs: 0,
    });
    const [recentBlogs, setRecentBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        const result = await blogService.getBlogs();
        if (result.success) {
            const blogs = result.blogs;
            const myBlogs = blogs.filter(blog => blog.authorId === user.uid);
            const published = blogs.filter(blog => blog.isPublished).length;
            const drafts = blogs.filter(blog => !blog.isPublished).length;
            
            setStats({
                blogs: blogs.length,
                published,
                drafts,
                myBlogs: myBlogs.length
            });
            
            // Show user's own blogs first, then others
            const sortedBlogs = [...myBlogs, ...blogs.filter(blog => blog.authorId !== user.uid)];
            setRecentBlogs(sortedBlogs.slice(0, 5));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDashboardData()
    }, []);

    return (
    <>
        <div className='flex-1 p-4 md:p-10 bg-blue-50/50'>
            <h1 className='text-2xl font-bold mb-6 text-gray-800'>Dashboard</h1>
            
            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <div className='animate-spin rounded-full h-16 w-16 border-4 border-t-primary border-gray-200'></div>
                </div>
            ) : (
                <>
                    <div className='flex flex-wrap gap-4 mb-8'>
                        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
                            <img src={assets.dashboard_icon_1} alt="" />
                            <div>
                                <p className='text-xl font-semibold text-gray-600'>{stats.myBlogs}</p>
                                <p className='text-gray-400 font-light'>My Blogs</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
                            <img src={assets.dashboard_icon_2} alt="" />
                            <div>
                                <p className='text-xl font-semibold text-gray-600'>{stats.blogs}</p>
                                <p className='text-gray-400 font-light'>Total Blogs</p>
                            </div>
                        </div>

                        <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
                            <img src={assets.dashboard_icon_3} alt="" />
                            <div>
                                <p className='text-xl font-semibold text-gray-600'>{stats.published}</p>
                                <p className='text-gray-400 font-light'>Published</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className='flex items-center gap-3 mb-4 text-gray-600'>
                            <img src={assets.dashboard_icon_4} alt="" />
                            <p className='text-lg font-medium'>Recent Blogs</p>
                        </div>

                        {recentBlogs.length > 0 ? (
                            <div className='relative max-w-6xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
                                <table className='w-full text-sm text-gray-500'>
                                    <thead className='text-xs text-gray-600 text-left uppercase bg-gray-50'>
                                        <tr>
                                            <th scope='col' className='px-4 py-3'>#</th>
                                            <th scope='col' className='px-4 py-3'>Image</th>
                                            <th scope='col' className='px-4 py-3'>Title</th>
                                            <th scope='col' className='px-4 py-3'>Category</th>
                                            <th scope='col' className='px-4 py-3 max-sm:hidden'>Date</th>
                                            <th scope='col' className='px-4 py-3 max-sm:hidden'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentBlogs.map((blog, index) => (
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
                                                    <div className='font-medium text-gray-900 truncate'>
                                                        {blog.title}
                                                        {blog.authorId === user.uid && (
                                                            <span className='ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded'>Mine</span>
                                                        )}
                                                    </div>
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
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className='bg-white rounded-lg shadow p-8 text-center'>
                                <p className='text-gray-500'>No blogs yet. Create your first blog!</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    </>
)
}

export default DashBoard