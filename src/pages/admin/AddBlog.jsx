import React, { useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { useAuth } from '../../context/AuthContext';
import { blogService } from '../../services/blogService';
import toast from 'react-hot-toast';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const AddBlog = () => {
    const { user } = useAuth();

    const editorRef = useRef(null);
    const quillRef = useRef(null);

    const [imageURL, setImageURL] = useState('');
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [category, setCategory] = useState('Technology');
    const [isPublished, setIsPublished] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const blogCategories = ['Technology', 'Startup', 'Lifestyle', 'Finance', 'Health', 'Travel'];

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (!title || !subTitle || !imageURL || !category) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (!quillRef.current) {
            toast.error('Please add blog content');
            return;
        }

        const content = quillRef.current.root.innerHTML;
        if (content.trim() === '<p><br></p>' || content.trim() === '' || content.trim() === '<p>Write your blog content here...</p>') {
            toast.error('Please add blog content');
            return;
        }

        setIsLoading(true);

        const blogData = {
            title,
            subTitle,
            description: content,
            category,
            imageURL,
            author: user?.email || 'Admin',
            isPublished
        };

        const result = await blogService.createBlog(blogData, user.uid);
        
        if (result.success) {
            toast.success('Blog created successfully!');
            // Reset form
            setTitle('');
            setSubTitle('');
            setImageURL('');
            setCategory('Technology');
            setIsPublished(true);
            if (quillRef.current) {
                quillRef.current.setText('');
            }
        } else {
            toast.error(result.error || 'Failed to create blog');
        }

        setIsLoading(false);
    };

    const generateContent = async () => {
        toast.info('AI content generation coming soon!');
    };

    useEffect(() => {
        // Initialize Quill only once
        if (!quillRef.current && editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['blockquote', 'code-block'],
                        ['link'],
                        ['clean']
                    ]
                },
                placeholder: 'Write your blog content here...'
            });
        }
    }, []);

    return (
        <div className='flex-1 bg-blue-50/50 text-gray-600 h-full overflow-auto'>
            <div className='bg-white w-full max-w-4xl p-4 md:p-10 sm:m-10 shadow rounded'>
                <h1 className='text-2xl font-bold mb-6 text-gray-800'>Create New Blog</h1>
                
                <form onSubmit={onSubmitHandler} className='space-y-6'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Blog Image URL
                        </label>
                        <input 
                            type="url" 
                            placeholder='Paste image URL (e.g., from Pexels)' 
                            required 
                            className='w-full max-w-lg p-3 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-primary focus:border-transparent' 
                            onChange={e => setImageURL(e.target.value)} 
                            value={imageURL}
                        />
                        {imageURL && (
                            <img src={imageURL} alt="Preview" className='mt-3 h-32 w-48 object-cover rounded-md border' />
                        )}
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Blog Title
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter blog title' 
                            required 
                            className='w-full max-w-lg p-3 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-primary focus:border-transparent' 
                            onChange={e => setTitle(e.target.value)} 
                            value={title}
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Sub Title
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter blog subtitle' 
                            required 
                            className='w-full max-w-lg p-3 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-primary focus:border-transparent' 
                            onChange={e => setSubTitle(e.target.value)} 
                            value={subTitle}
                        />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Blog Category
                        </label>
                        <select 
                            name="category" 
                            className='p-3 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-gray-700' 
                            onChange={e => setCategory(e.target.value)}
                            value={category}
                        >
                            {blogCategories.map((item, index) => (
                                <option value={item} key={index}>{item}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Blog Content
                        </label>
                        <div className='relative'>
                            <div 
                                ref={editorRef}
                                className='bg-white border border-gray-300 rounded-md'
                                style={{ minHeight: '300px' }}
                            ></div>
                            <button 
                                type='button' 
                                onClick={generateContent} 
                                className='absolute bottom-3 right-3 text-xs text-white bg-black/70 px-4 py-2 rounded hover:bg-black/80 transition-all cursor-pointer'
                            >
                                Generate with AI
                            </button>
                        </div>
                    </div>

                    <div className='flex items-center gap-3'>
                        <input 
                            type="checkbox" 
                            id="publish"
                            checked={isPublished} 
                            className='w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary cursor-pointer' 
                            onChange={e => setIsPublished(e.target.checked)} 
                        />
                        <label htmlFor="publish" className='text-sm font-medium text-gray-700 cursor-pointer'>
                            Publish Now
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className='w-full max-w-xs bg-primary text-white py-3 px-6 rounded-md cursor-pointer text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {isLoading ? 'Creating...' : 'Create Blog'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddBlog;