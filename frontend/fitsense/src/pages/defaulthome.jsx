import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import Button from '../components/button';
import logo from '../images/FitSense-ai-logo.webp';

const DefaultHome = () => {
    const [user] = useAuthState(auth);

    if (user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-700 flex flex-col items-center justify-center p-8">
            <div className="max-w-5xl mx-auto text-center space-y-12">
                <img 
                    src={logo} 
                    alt="FitSense Logo" 
                    className="mx-auto h-64 w-auto mb-12 hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
                />
                <div className="space-y-6">
                    <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400">
                        Welcome to FitSense
                    </h1>
                    <p className="text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Track your workouts, achieve your fitness goals, and transform your life.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
                    <Link to="/signin">
                        <Button className="w-48 h-12 text-lg hover:scale-105 transition-transform duration-300">
                            Sign In
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button className="w-48 h-12 text-lg hover:scale-105 transition-transform duration-300">
                            Create Account
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DefaultHome;