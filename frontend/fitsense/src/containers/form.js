import React, { useState } from 'react';
import { GoogleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import logo from "./../images/FitSense-ai-logo.webp";
import Button from '../components/button';
import '../styles/custom.css';

const AuthForm = ({ isSignUp }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onFinish = async (e) => {
    e.preventDefault();

    if (isSignUp && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
        alert('Sign up successful!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Sign in successful!');
      }
      navigate('/workouts');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert('Signed in with Google successfully!');
      navigate('/workouts');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center items-center bg-gradient-to-b from-zinc-800 to-zinc-700">
      <div className="w-[640px] mx-auto p-8 rounded-lg bg-zinc-700 shadow-lg shadow-zinc-900/50 transition-all duration-300 hover:shadow-xl">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-45 w-auto hover:scale-105 transition-transform duration-300" src={logo} alt='FitSense'/>
          <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-gray-300">{isSignUp ? 'Create your account' : 'Sign into your account'}</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" onSubmit={onFinish}>
            {isSignUp && (
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-zinc-300">Username</label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    required
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 
                    outline outline-1 -outline-offset-1 outline-gray-300 
                    placeholder:text-gray-400 
                    transition-all duration-200
                    hover:outline-red-300
                    focus:outline-2 focus:-outline-offset-2 focus:outline-red-400 
                    focus:ring-1 focus:ring-red-400
                    sm:text-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">Email address</label>
              <div className="mt-2">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-400 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300">Password</label>
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-400 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300">Confirm Password</label>
                <div className="mt-2">
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    autoComplete="new-password"
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-400 sm:text-sm"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <Button type="submit" className="w-full">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </div>
          </form>
          
          {!isSignUp && (
          <div className="flex items-center justify-center mt-6">
            <Button onClick={handleGoogleSignIn} className="w-full">
              <GoogleOutlined className="w-6 h-6 text-red-300"/>
              Sign in with Google
            </Button>
          </div>
          )}

          <div className="flex items-center justify-center mt-6 text-zinc-300">
            {isSignUp ? (
              <Link to="/signin">Already have an account? Sign in</Link>
            ) : (
              <Link to="/signup">Don't have an account? Sign up now!</Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;