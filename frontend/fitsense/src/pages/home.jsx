import React from "react";
import Card from '../components/card';
import { FiActivity, FiTrendingUp, FiAward, FiClipboard, FiPlus } from 'react-icons/fi';
import { GiWeightLiftingUp, GiMeal } from 'react-icons/gi';

const Home = () => {
    const cards = [
        {
            title: "Track Workouts",
            description: "Keep track of your workouts and monitor your progress over time. Stay motivated and reach your fitness goals.",
            icon: <GiWeightLiftingUp className="w-12 h-12 text-red-400 mx-auto" />,
            linkTo: "/workouts",
            linkText: "View Workouts"
        },
        {
            title: "Create Workouts",
            description: "Design and customize your workout routines. Add exercises, sets, and reps to create the perfect workout plan.",
            icon: <FiPlus className="w-12 h-12 text-red-400 mx-auto" />,
            linkTo: "/create-workout",
            linkText: "Create Workout"
        },
        {
            title: "View Meal Plans",
            description: "Browse through your personalized meal plans. Track your nutrition and maintain a balanced diet.",
            icon: <GiMeal className="w-12 h-12 text-red-400 mx-auto" />,
            linkTo: "/meal-plans",
            linkText: "View Meal Plans"
        },
        {
            title: "Create Meal Plan",
            description: "Design your perfect meal plan. Add meals, track macros, and maintain a healthy diet.",
            icon: <FiClipboard className="w-12 h-12 text-red-400 mx-auto" />,
            linkTo: "/create-meal-plan",
            linkText: "Create Meal Plan"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-800 to-zinc-700">
            {/* Hero Section */}
            <div className="py-20 px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-red-400 mb-6">
                        Welcome to FitSense
                    </h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
                        Your ultimate fitness companion. Track your workouts, plan your meals, and achieve your fitness dreams with FitSense.
                    </p>
                    
                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                        {cards.map((card, index) => (
                            <Card key={index} {...card} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-zinc-900/50 py-16">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <FiActivity className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-300 mb-2">Track Progress</h3>
                            <p className="text-gray-400">Monitor your fitness journey with detailed tracking and analytics</p>
                        </div>
                        <div className="text-center">
                            <FiTrendingUp className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-300 mb-2">Set Goals</h3>
                            <p className="text-gray-400">Set and achieve your fitness goals with personalized plans</p>
                        </div>
                        <div className="text-center">
                            <FiAward className="w-12 h-12 text-red-400 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-300 mb-2">Stay Motivated</h3>
                            <p className="text-gray-400">Keep motivated with achievements and progress tracking</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-16 px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-300 mb-12">Everything You Need</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            "Customizable workout plans",
                            "Detailed nutrition tracking",
                            "Meal planning tools",
                        ].map((feature, index) => (
                            <div key={index} className="bg-zinc-800/50 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                <p className="text-gray-300 font-medium">{feature}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;