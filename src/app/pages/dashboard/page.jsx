"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Button, Modal } from '@mui/material';
import { MdDelete, MdEdit } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { UserAuth } from '@/app/context/AuthContext';
import { supabase } from '@/app/utils/supabaseClient';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const Dashboard = () => {
    const { session, signOut } = UserAuth();
    const router = useRouter();

    const [blogs, setBlogs] = useState([]);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            const { data, error } = await supabase.from('BlogApp').select('*');
            if (error) console.error('Error fetching blogs:', error);
            else setBlogs(data);
        };
        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        const { error } = await supabase.from('BlogApp').delete().match({ id });
        if (error) {
            console.error('Error deleting record:', error);
        } else {
            setBlogs(blogs.filter(blog => blog.id !== id));
            toast.success("Blog Deleted Successfully");
        }
    };

    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpen = (blog = null) => {
        if (blog) {
            setEditingId(blog.id);
            setTitle(blog.title);
            setContent(blog.content);
        } else {
            setEditingId(null);
            setTitle('');
            setContent('');
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            // Edit existing blog
            const { error } = await supabase
                .from('BlogApp')
                .update({ title, content })
                .match({ id: editingId });

            if (error) {
                console.error('Error updating blog:', error);
            } else {
                setBlogs(blogs.map(blog => (blog.id === editingId ? { ...blog, title, content } : blog)));
                toast.success("Blog updated successfully");
            }
        } else {
            // Add new blog
            const { error } = await supabase.from('BlogApp').insert([{ title, content }]);
            if (error) {
                console.error('Error adding blog:', error);
            } else {
                toast.success("Blog added successfully");
                setBlogs([...blogs, { id: Date.now(), title, content }]);
            }
        }
        setTitle('');
        setContent('');
        handleClose();
    };

    return (
        <div>
            <div className='bg-black flex items-center justify-between p-4 flex-wrap'>
                <Link href='/'>
                    <h1 className='text-white font-bold text-xl lg:text-3xl cursor-pointer'>
                        BLOGS BY AFTAB
                    </h1>
                </Link>
                <div className='flex gap-4 lg:gap-6 mt-2 lg:mt-0'>
                        <button onClick={() => handleOpen()} className='rounded px-4 py-2 text-white border border-white transition duration-200 hover:bg-white hover:text-black'>
                            Add Blogs
                        </button>
                    <button
                        onClick={handleSignOut}
                        className='rounded px-4 py-2 text-white border border-white transition duration-200 hover:bg-white hover:text-black'>
                        Log Out
                    </button>
                </div>
            </div>
            <div className='h-[calc(100vh-142px)] flex flex-col justify-start items-center font-semibold bg-gray-100 p-6 overflow-y-scroll'>
                <div className='py-6 flex flex-col items-center'>
                    <h1 className='text-4xl font-bold text-gray-800'>Aftab's Blogs</h1>
                    <p className='text-slate-600 my-4 text-lg'>A blog with posts on what I like</p>
                </div>
                <div className='w-full max-w-3xl'>
                    {blogs.map(blog => (
                        <div key={blog.id} className="blog bg-white shadow-md rounded-lg p-4 mb-6">
                            <div className='flex justify-between'>
                                <h2 className='text-xl font-semibold text-gray-800'>Title:</h2>
                                <div className='flex justify-center items-center'>
                                    <MdEdit onClick={() => handleOpen(blog)} className='text-green-600 bg-slate-100 rounded-full text-2xl cursor-pointer mr-2' />
                                    <MdDelete onClick={() => handleDelete(blog.id)} className='text-red-600 text-2xl cursor-pointer' />
                                </div>
                            </div>
                            <h3 className='text-2xl font-bold text-gray-900'>{blog.title}</h3>
                            <h2 className='text-xl font-semibold text-gray-800 mt-4'>Content:</h2>
                            <p className='text-gray-700'>{blog.content}</p>
                            <p className='text-gray-500 text-sm mt-2'>{new Date(blog.created_at).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
                {/* Modal */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <form onSubmit={handleSubmit} className='w-full max-w-md space-y-4'>
                            <div className='flex flex-col'>
                                <label className='mb-1 text-xl'>Title :</label>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className='border-2 p-2 rounded-md focus:outline-none focus:border-black transition duration-200'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='flex flex-col'>
                                <label className='mb-1 text-xl'>Content :</label>
                                <textarea
                                    placeholder="Content"
                                    className='border-2 p-2 rounded-md focus:outline-none focus:border-black transition duration-200'
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type='submit'
                                className='w-full py-2 mt-4 rounded-md bg-black text-white hover:bg-gray-800 transition duration-200'
                            >
                                {editingId ? 'Update' : 'Add'}
                            </button>
                        </form>
                    </Box>
                </Modal>
                <ToastContainer />
            </div>
        </div>
    );
};

export default Dashboard;
