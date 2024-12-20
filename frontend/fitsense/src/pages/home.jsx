import React from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import Card from '../components/card';

const Home = () => {
    const [user] = useAuthState(auth);

    const cards = [
        {
            title: "Track Workouts",
            description: "Keep track of your workouts and monitor your progress over time. Stay motivated and reach your fitness goals.",
            icon: (
                <svg className="w-12 h-12 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            linkTo: "/workouts",
            linkText: "View Workouts"
        },
        {
            title: "Create Workouts",
            description: "Design and customize your workout routines. Add exercises, sets, and reps to create the perfect workout plan.",
            icon: (
                <svg className="w-12 h-12 text-red-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
            linkTo: "/create",
            linkText: "Create Workout"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-700 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-300 mb-4">Welcome to FitSense</h1>
                <p className="text-center text-gray-400 mb-12">
                    Your ultimate fitness companion. Track your workouts, set goals, and achieve your fitness dreams with FitSense.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <Card key={index} {...card} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;