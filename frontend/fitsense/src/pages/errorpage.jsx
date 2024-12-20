import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-700 flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
            <div className="bg-zinc-800/50 rounded-lg p-8 shadow-lg shadow-zinc-900/50 transition-all duration-300 hover:shadow-xl text-center max-w-xl">
                <p className="text-base font-semibold text-red-400">404</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-300 sm:text-7xl">
                    Page not found
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-400">
                    Sorry, we couldn't find the page you're looking for.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button onClick={() => navigate('/')}>
                        Go back home
                    </Button>
                </div>
            </div>
        </main>
    );
};

export default ErrorPage;