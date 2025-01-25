import React, { useState, useMemo } from "react";
import { db, auth } from "../config/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Button from "../components/button";

const CreateMealPlan = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentDay, setCurrentDay] = useState("Sunday");
    const [mealType, setMealType] = useState("breakfast");
    
    const [days, setDays] = useState({
        Sunday: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        Monday: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        Tuesday: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        Wednesday: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        Thursday: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        Friday: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        Saturday: { breakfast: [], lunch: [], dinner: [], snacks: [] }
    });

    const [mealName, setMealName] = useState("");
    const [protein, setProtein] = useState("");
    const [calories, setCalories] = useState("");
    const [fats, setFats] = useState("");
    const [carbs, setCarbs] = useState("");

    const mealPlanCollectionRef = useMemo(() => collection(db, "meal-plans"), []);

    const handleAddTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag("");
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleAddMeal = () => {
        if (!mealName) {
            alert("Please enter a meal name");
            return;
        }

        if (!protein || !calories || !fats || !carbs) {
            alert("Please fill in all nutritional values");
            return;
        }

        if (protein < 0 || calories < 0 || fats < 0 || carbs < 0) {
            alert("Nutritional values cannot be negative");
            return;
        }

        const newMeal = {
            name: mealName,
            protein: Math.max(0, Number(protein)),
            calories: Math.max(0, Number(calories)),
            fats: Math.max(0, Number(fats)),
            carbs: Math.max(0, Number(carbs))
        };

        setDays(prev => ({
            ...prev,
            [currentDay]: {
                ...prev[currentDay],
                [mealType]: [...prev[currentDay][mealType], newMeal]
            }
        }));

        setMealName("");
        setProtein("");
        setCalories("");
        setFats("");
        setCarbs("");
    };

    const removeMeal = (day, mealType, index) => {
        setDays(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [mealType]: prev[day][mealType].filter((_, i) => i !== index)
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name) {
            alert("Please enter a meal plan name");
            return;
        }

        const hasMeals = Object.values(days).some(day => 
            Object.values(day).some(mealType => mealType.length > 0)
        );

        if (!hasMeals) {
            alert("Please add at least one meal to your plan");
            return;
        }

        try {
            await addDoc(mealPlanCollectionRef, {
                name,
                description,
                tags,
                days,
                isFavorite,
                userId: auth.currentUser.uid,
                createdAt: new Date().toISOString()
            });
            alert("Meal plan created successfully!");
            navigate("/meal-plans");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-800 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-zinc-800/50 rounded-lg p-8 shadow-lg shadow-zinc-900/50 transition-all duration-300">
                    <h1 className="text-3xl font-bold text-gray-300 mb-8">Create New Meal Plan</h1>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300">
                                    Meal Plan Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full rounded-md bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Day and Meal Type Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300">Day</label>
                                <select
                                    value={currentDay}
                                    onChange={(e) => setCurrentDay(e.target.value)}
                                    className="mt-1 block w-full rounded-md bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-2"
                                >
                                    {Object.keys(days).map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-300">Meal Type</label>
                                <select
                                    value={mealType}
                                    onChange={(e) => setMealType(e.target.value)}
                                    className="mt-1 block w-full rounded-md bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-2"
                                >
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="snacks">Snacks</option>
                                </select>
                            </div>
                        </div>

                        {/* Meal Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={mealName}
                                onChange={(e) => setMealName(e.target.value)}
                                placeholder="Meal name"
                                className="rounded-md bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-2"
                            />
                            <input
                                type="number"
                                min="0"
                                value={protein}
                                onChange={(e) => setProtein(Math.max(0, Number(e.target.value)))}
                                placeholder="Protein (g)"
                                className="rounded-md bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-2"
                            />
                            <input
                                type="number"
                                min="0"
                                value={calories}
                                onChange={(e) => setCalories(Math.max(0, Number(e.target.value)))}
                                placeholder="Calories"
                                className="rounded-md bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-2"
                            />
                            <input
                                type="number"
                                min="0"
                                value={fats}
                                onChange={(e) => setFats(Math.max(0, Number(e.target.value)))}
                                placeholder="Fats (g)"
                                className="rounded-md bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-2"
                            />
                            <input
                                type="number"
                                min="0"
                                value={carbs}
                                onChange={(e) => setCarbs(Math.max(0, Number(e.target.value)))}
                                placeholder="Carbs (g)"
                                className="rounded-md bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-2"
                            />
                        </div>

                        <Button type="button" onClick={handleAddMeal}>
                            Add Meal
                        </Button>

                        {/* Display Meals */}
                        <div className="space-y-4">
                            {Object.entries(days[currentDay]).map(([type, meals]) => (
                                <div key={type} className="space-y-2">
                                    <h3 className="text-lg font-medium text-zinc-300 capitalize">{type}</h3>
                                    {meals.map((meal, index) => (
                                        <div key={index} 
                                             className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg">
                                            <div>
                                                <h4 className="text-zinc-300 font-medium">{meal.name}</h4>
                                                <p className="text-zinc-400 text-sm">
                                                    Protein: {meal.protein}g | 
                                                    Calories: {meal.calories} | 
                                                    Fats: {meal.fats}g | 
                                                    Carbs: {meal.carbs}g
                                                </p>
                                            </div>
                                            <Button type="button" 
                                                    onClick={() => removeMeal(currentDay, type, index)}>
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Tags Section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-300">Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <span key={index} 
                                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-red-400/20 text-red-400">
                                        {tag}
                                        <button type="button"
                                                onClick={() => removeTag(index)}
                                                className="ml-1.5 hover:text-red-300">
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    className="flex-1 rounded-md bg-zinc-900 border-zinc-700 text-zinc-300 px-3 py-2"
                                    placeholder="Add a tag"
                                />
                                <Button type="button" onClick={handleAddTag}>
                                    Add Tag
                                </Button>
                            </div>
                        </div>

                        {/* Favorite Toggle */}
                        <div className="flex items-center space-x-2 mb-4">
                            <button
                                type="button"
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`p-2 rounded-full transition-colors duration-200 
                                         ${isFavorite ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-gray-300'}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                            <label className="text-sm font-medium text-zinc-300">
                                Mark as Favorite
                            </label>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4">
                            <Button type="button" onClick={() => navigate('/meal-plans')}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Create Meal Plan
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateMealPlan;