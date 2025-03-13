"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { Router } from 'next/navigation';
import { UserAuth } from '@/app/context/AuthContext';

const Signup = () => {
    const { signUpNewUser } = UserAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const result = await signUpNewUser(email, password);
            if (result.success) {
                Router.push('/pages/dashboard');
            }
        } catch (err) {
            setError("An error occurred");
        }
    };

    return (
        <div className='flex flex-col items-center justify-center h-screen p-4'>
            <h1 className='text-4xl font-semibold mb-4'>Account Signup</h1>
            <form onSubmit={handleSignUp} className='w-full max-w-md space-y-4'>
                {/* Email */}
                <div className='flex flex-col'>
                    <label className='mb-1'>Email Address:</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className='border-2 p-2 rounded-md focus:outline-none focus:border-black transition duration-200'
                        placeholder='Enter your email'
                        required
                    />
                </div>

                {/* Password */}
                <div className='flex flex-col'>
                    <label className='mb-1'>Password:</label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        className='border-2 p-2 rounded-md focus:outline-none focus:border-black transition duration-200'
                        placeholder='Enter your password'
                        required
                    />
                </div>

                {error && <p className='text-red-600 text-center pt-2'>{error}</p>}

                <button
                    type='submit'
                    className='w-full py-2 mt-4 rounded-md bg-black text-white hover:bg-gray-800 transition duration-200'
                >
                    Sign Up
                </button>
            </form>
            <p className='text-slate-600 mt-4'>
                Already have an account?{' '}
                <Link href={'/pages/login'}>
                    <span className='text-black font-medium'>Login here</span>
                </Link>
            </p>
        </div>
    );
}

export default Signup;
