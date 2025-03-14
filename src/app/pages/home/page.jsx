"use client";

import { supabase } from '@/app/utils/supabaseClient';
import React, { useEffect, useState } from 'react';
import Header from '@/app/modules/Header/page';

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabase.from('BlogApp').select('*');
      if (error) console.error('Error fetching blogs:', error);
      else setBlogs(data);
    };
    fetchBlogs();
  }, []);

  return (
    <>
    <Header />
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
            </div>
            <h3 className='text-2xl font-bold text-gray-900'>{blog.title}</h3>
            <h2 className='text-xl font-semibold text-gray-800 mt-4'>Content:</h2>
            <p className='text-gray-700'>{blog.content}</p>
            <p className='text-gray-500 text-sm mt-2'>{new Date(blog.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Home;
