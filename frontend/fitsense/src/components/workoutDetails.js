import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import Button from '../components/button';

const WorkoutDetails = () => {
    const { id } = useParams();
    const [workout, setWorkout] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Memoize the document reference
    const workoutDocRef = useMemo(() => doc(db, "workout-programs", id), [id]);

    const deleteWorkout = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this workout?");
        if (!confirmed) {
            return;
        }

        try {
            await deleteDoc(workoutDocRef);
            alert("Workout successfully deleted");
            navigate("/workouts");
        } catch (err) {
            alert("Error deleting this workout: " + err.message);
        }
    };

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const workoutDoc = await getDoc(workoutDocRef);
                if (workoutDoc.exists()) {
                    setWorkout(workoutDoc.data());
                } else {
                    console.error("No such document");
                }
            } catch (err) {
                console.error("Error fetching workout: ", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkout();
    }, [workoutDocRef]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-400"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-800 p-8">
            <div className="max-w-4xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-400"></div>
                    </div>
                ) : (
                    <div className="bg-zinc-800/50 rounded-lg p-8 shadow-lg shadow-zinc-900/50 transition-all duration-300">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                            <h1 className={`text-xl font-bold mb-4 
                                ${workout.isFavorite 
                                    ? 'bg-gradient-to-r from-red-400 via-orange-400 to-red-400 text-transparent bg-clip-text' 
                                    : 'text-gray-300'}`}>
                                {workout.name}
                            </h1>
                                <p className="text-gray-400">{workout.description}</p>
                            </div>
                            <div className="flex space-x-4">
                                <Link to={`/workout/${id}/edit`}>
                                    <Button>Edit Workout</Button>
                                </Link>
                                <Button onClick={deleteWorkout}>Delete Workout</Button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                                {workout.tags?.map((tag, index) => (
                                    <span key={index} 
                                          className="px-2.5 py-0.5 rounded-full text-sm bg-red-400/20 text-red-400">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {Object.entries(workout.days || {}).map(([day, exercises]) => 
                                exercises.length > 0 && (
                                    <div key={day} className="bg-zinc-900/50 rounded-lg p-6">
                                        <h2 className="text-xl font-semibold text-gray-300 mb-4">{day}</h2>
                                        <div className="space-y-4">
                                            {exercises.map((exercise, index) => (
                                                <div key={index} 
                                                     className="flex justify-between items-center p-4 bg-zinc-800 rounded-lg
                                                              hover:bg-zinc-700/50 transition-colors duration-200">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-300">
                                                            {exercise.name}
                                                        </h3>
                                                        <p className="text-gray-400">
                                                            {exercise.sets} sets × {exercise.reps} reps
                                                        </p>
                                                        {exercise.restTime && (
                                                            <p className="text-gray-500 text-sm">
                                                                Rest: {exercise.restTime}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {workout.notes && (
                            <div className="mt-8 p-4 bg-zinc-900/30 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-300 mb-2">Notes</h3>
                                <p className="text-gray-400">{workout.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutDetails;