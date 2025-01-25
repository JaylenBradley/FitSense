import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc, collection } from "firebase/firestore";
import Button from "../components/button";

const UpdateWorkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [description, setDescription] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);

    const [days, setDays] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    });

    const [currentDay, setCurrentDay] = useState("Sunday");
    const [exerciseName, setExerciseName] = useState("");
    const [reps, setReps] = useState("");
    const [sets, setSets] = useState("");
    const [restTime, setRestTime] = useState("");

    // Use useMemo to memoize the collection reference
    const workoutCollectionRef = useMemo(() => collection(db, "workout-programs"), []);

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const workoutDoc = await getDoc(doc(workoutCollectionRef, id));
                if (workoutDoc.exists()) {
                    const data = workoutDoc.data();
                    setName(data.name);
                    setType(data.type);
                    setTags(data.tags);
                    setDescription(data.description);
                    setIsFavorite(data.isFavorite);
                    setDays(data.days);
                } else {
                    console.error("No such document");
                }
            } catch (err) {
                console.error("Error fetching workout: ", err);
            }
        };

        fetchWorkout();
    }, [id, workoutCollectionRef]);

    const handleAddExercise = () => {
        if (!exerciseName) {
            alert("Please enter an exercise name");
            return;
        }

        if (!sets || !reps || !restTime) {
            alert("Please fill in all exercise details");
            return;
        }

        if (sets < 0 || reps < 0 || restTime < 0) {
            alert("Exercise values cannot be negative");
            return;
        }

        const newExercise = {
            exerciseName,
            sets: Math.max(0, Number(sets)),
            reps: Math.max(0, Number(reps)),
            restTime: Math.max(0, Number(restTime))
        };

        setDays(prev => ({
            ...prev,
            [currentDay]: [...prev[currentDay], newExercise]
        }));

        // Reset form
        setExerciseName("");
        setSets("");
        setReps("");
        setRestTime("");
    };

    const handleRemoveExercise = (day, index) => {
        setDays({
            ...days,
            [day]: days[day].filter((_, i) => i !== index)
        });
    };

    const handleAddTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag("");
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSaveWorkout = async (e) => {
        e.preventDefault();
        
        if (!name) {
            alert("Please enter a workout name");
            return;
        }
    
        try {
            await updateDoc(doc(db, "workout-programs", id), {
                name,
                type,
                tags,
                description,
                isFavorite,
                days,
                updatedAt: new Date().toISOString()
            });
            alert("Workout updated successfully!");
            navigate("/workouts");
        } catch (err) {
            alert(err.message);
        }
    };

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <div className="min-h-screen bg-zinc-800 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-zinc-800/50 rounded-lg p-8 shadow-lg shadow-zinc-900/50 transition-all duration-300">
                    <h1 className="text-3xl font-bold text-gray-300 mb-8">Update Workout</h1>
                    
                    <form onSubmit={handleSaveWorkout} className="space-y-6">

                        {/* Basic Info Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300">
                                    Workout Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full rounded-md bg-zinc-900 border-zinc-700 
                                             text-zinc-300 shadow-sm focus:border-red-400 focus:ring 
                                             focus:ring-red-400 focus:ring-opacity-50 px-3 py-2"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300">
                                    Type
                                </label>
                                <input
                                    type="text"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="mt-1 block w-full rounded-md bg-zinc-900 border-zinc-700 
                                             text-zinc-300 shadow-sm focus:border-red-400 focus:ring 
                                             focus:ring-red-400 focus:ring-opacity-50 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full rounded-md bg-zinc-900 border-zinc-700 
                                             text-zinc-300 shadow-sm focus:border-red-400 focus:ring 
                                             focus:ring-red-400 focus:ring-opacity-50 px-3 py-2"
                                />
                            </div>
                        </div>

                        {/* Tags Section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-300">Tags</label>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag, index) => (
                                    <span key={index} 
                                          className="inline-flex items-center px-2.5 py-0.5 
                                                   rounded-full text-sm bg-red-400/20 text-red-400">
                                        {tag}
                                        <button type="button"
                                                onClick={() => handleRemoveTag(tag)}
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
                                    className="flex-1 rounded-md bg-zinc-900 border-zinc-700 
                                             text-zinc-300 px-3 py-2
                                             transition-all duration-200
                                             hover:bg-zinc-800"
                                    placeholder="Add a tag"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddTag}
                                >
                                    Add Tag
                                </Button>
                            </div>
                        </div>

                        {/* Exercises Section */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-zinc-300">Exercises</h2>
                            <select
                                value={currentDay}
                                onChange={(e) => setCurrentDay(e.target.value)}
                                className="block w-full rounded-md bg-zinc-900 border-zinc-700 
                                         text-zinc-300 px-3 py-2
                                         transition-all duration-200
                                         hover:bg-zinc-800"
                            >
                                {daysOfWeek.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Exercise Input Fields */}
                                <input
                                    type="text"
                                    value={exerciseName}
                                    onChange={(e) => setExerciseName(e.target.value)}
                                    placeholder="Exercise name"
                                    className="rounded-md bg-zinc-900 border-zinc-700 
                                             text-zinc-300 px-3 py-2
                                             transition-all duration-200
                                             hover:bg-zinc-800"
                                />
                                <input 
                                    placeholder="Enter sets" 
                                    type="number" 
                                    min="0"
                                    value={sets}
                                    onChange={(e) => setSets(Math.max(0, Number(e.target.value)))}
                                    className="rounded-md bg-zinc-900 border-zinc-700 
                                             text-zinc-300 px-3 py-2
                                             transition-all duration-200
                                             hover:bg-zinc-800"
                                />
                                <input 
                                    placeholder="Enter reps" 
                                    type="number" 
                                    min="0"
                                    value={reps}
                                    onChange={(e) => setReps(Math.max(0, Number(e.target.value)))}
                                    className="rounded-md bg-zinc-900 border-zinc-700 
                                             text-zinc-300 px-3 py-2
                                             transition-all duration-200
                                             hover:bg-zinc-800"
                                />
                                <input 
                                    placeholder="Enter rest time" 
                                    type="number" 
                                    min="0"
                                    value={restTime}
                                    onChange={(e) => setRestTime(Math.max(0, Number(e.target.value)))}
                                    className="rounded-md bg-zinc-900 border-zinc-700 
                                             text-zinc-300 px-3 py-2
                                             transition-all duration-200
                                             hover:bg-zinc-800"
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={handleAddExercise}
                            >
                                Add Exercise
                            </Button>

                            {/* Exercise List */}
                            <div className="mt-4">
                                {days[currentDay].map((exercise, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-zinc-900 rounded-lg mb-2"
                                    >
                                        <div>
                                            <h3 className="text-zinc-300 font-medium">{exercise.exerciseName}</h3>
                                            <p className="text-zinc-400">
                                                {exercise.sets} sets × {exercise.reps} reps
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={() => handleRemoveExercise(currentDay, index)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Favorite Toggle Button */}
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

                        <div className="flex justify-end space-x-4 pt-6">
                            <Button type="button" onClick={() => navigate(`/workout/${id}`)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Update Workout
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateWorkout;