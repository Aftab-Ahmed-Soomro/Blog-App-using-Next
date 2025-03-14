"use client"

import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../utils/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);

  // Sign Up 
  const signUpNewUser = async(email, password) => {
    const {data,error} = await supabase.auth.signUp({
      email : email,
      password : password
    });

    if(error) {
      console.log("there was a problem signing up : ", error);
      return {success : false, error }
    }
    return {success : true, data}
  }

  // Sign in
  const signInUser = async (email, password) => {
    try {
      const {data, error} = await supabase.auth.signInWithPassword({
        email : email,
        password : password
      })
      if (error) {
        console.error("sign in error occurred :", error)
        return {success : false, error : error.message}
      }
      console.log("sign-in success :", data)
      return {success : true, data }
    } catch (error) {
      console.error("an error occured :",error)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({data : {session}}) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  },[])

  // Sign Out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log("there was an error: ", error);
    }
}

  return (
    <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext)
}