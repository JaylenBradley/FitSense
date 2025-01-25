import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Button from './button';

const MealPlanModal = ({ mealPlan, onClose, isOpen }) => {
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen || !mealPlan) return null;

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "meal-plans", mealPlan.id));
            onClose();
            window.location.reload();
        } catch (err) {
            alert("Error deleting meal plan: " + err.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className={`text-2xl font-bold mb-2 
                                ${mealPlan.isFavorite 
                                    ? 'bg-gradient-to-r from-red-400 via-orange-400 to-red-400 text-transparent bg-clip-text' 
                                    : 'text-gray-300'}`}>
                                {mealPlan.name}
                            </h2>
                            <p className="text-gray-400">{mealPlan.description}</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tags */}
                    {mealPlan.tags && mealPlan.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {mealPlan.tags.map((tag, index) => (
                                <span 
                                    key={index}
                                    className="px-2.5 py-0.5 rounded-full text-sm bg-red-400/20 text-red-400"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Daily Meals */}
                    <div className="space-y-6">
                        {Object.entries(mealPlan.days).map(([day, meals]) => (
                            <div key={day} className="bg-zinc-900/50 rounded-lg p-4">
                                <h3 className="text-xl font-semibold text-gray-300 mb-4">{day}</h3>
                                <div className="space-y-4">
                                    {Object.entries(meals).map(([mealType, mealItems]) => (
                                        <div key={mealType} className="space-y-2">
                                            <h4 className="text-lg font-medium text-gray-400 capitalize">
                                                {mealType}
                                            </h4>
                                            {mealItems.length > 0 ? (
                                                <div className="space-y-2">
                                                    {mealItems.map((meal, index) => (
                                                        <div 
                                                            key={index}
                                                            className="bg-zinc-800/50 rounded p-3"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <h5 className="text-gray-300 font-medium">
                                                                    {meal.name}
                                                                </h5>
                                                            </div>
                                                            <div className="mt-2 text-sm text-gray-400 grid grid-cols-2 gap-2">
                                                                <span>Calories: {meal.calories}</span>
                                                                <span>Protein: {meal.protein}g</span>
                                                                <span>Carbs: {meal.carbs}g</span>
                                                                <span>Fats: {meal.fats}g</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 italic">No meals planned</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer with Actions */}
                    <div className="flex justify-end space-x-4">
                        {isDeleting ? (
                            <>
                                <p className="text-gray-300 mr-4 self-center">Are you sure?</p>
                                <Button onClick={() => setIsDeleting(false)}>Cancel</Button>
                                <Button onClick={handleDelete}>Confirm Delete</Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => navigate(`/meal-plan/${mealPlan.id}/edit`)}>
                                    Edit
                                </Button>
                                <Button onClick={() => setIsDeleting(true)}>
                                    Delete
                                </Button>
                                <Button onClick={onClose}>Close</Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MealPlanModal;