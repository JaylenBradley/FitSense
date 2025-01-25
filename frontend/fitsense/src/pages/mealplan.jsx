import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Button from '../components/button';
import MealPlanModal from '../components/mealplanModal';

const MealPlan = () => {
    const [mealPlans, setMealPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const mealPlanCollectionRef = useMemo(() => collection(db, 'meal-plans'), []);
    const [selectedMealPlan, setSelectedMealPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchMealPlans = async (user) => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const q = query(mealPlanCollectionRef, where('userId', '==', user.uid));
                const data = await getDocs(q);
                const fetchedMealPlans = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setMealPlans(fetchedMealPlans);
            } catch (err) {
                console.error('Error getting meal plans: ', err);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            fetchMealPlans(user);
        });

        return () => unsubscribe();
    }, [mealPlanCollectionRef]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-800 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-300">Your Meal Plans</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mealPlans.map((mealPlan) => (
                        <div 
                            key={mealPlan.id}
                            className="bg-zinc-800/50 rounded-lg p-6 shadow-lg shadow-zinc-900/50 
                                     transition-all duration-300 hover:shadow-xl"
                        >
                            <h2 className={`text-xl font-bold mb-4 
                                ${mealPlan.isFavorite 
                                    ? 'bg-gradient-to-r from-red-400 via-orange-400 to-red-400 text-transparent bg-clip-text' 
                                    : 'text-gray-300'}`}>
                                {mealPlan.name}
                            </h2>
                            <p className="text-gray-400 mb-4">{mealPlan.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {mealPlan.tags?.map((tag, index) => (
                                    <span 
                                        key={index}
                                        className="px-2.5 py-0.5 rounded-full text-sm bg-red-400/20 text-red-400"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Button 
                                    onClick={() => {
                                        setSelectedMealPlan(mealPlan);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    View Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                <MealPlanModal 
                    mealPlan={selectedMealPlan}
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedMealPlan(null);
                    }}
                />
                {mealPlans.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg mb-6">No meal plans found. Create your first meal plan!</p>
                        <Link to="/create-meal-plan">
                            <Button>Create Meal Plan</Button>
                        </Link>
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default MealPlan;