import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthForm from "./containers/form";
import Workouts from "./pages/workouts";
import CreateWorkout from "./pages/createworkout";
import WorkoutDetails from "./components/workoutDetails";
import ErrorPage from "./pages/errorpage"; 
import Layout from "./containers/layout";
import Home from "./pages/home";
import UpdateWorkout from "./pages/updateworkout";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} /> 
                    <Route path="signin" element={<AuthForm isSignUp={false} />} />
                    <Route path="signup" element={<AuthForm isSignUp={true} />} />
                    <Route path="workouts" element={<Workouts />} />
                    <Route path="create" element={<CreateWorkout />} />
                    <Route path="workouts/:id" element={<WorkoutDetails />} />
                    <Route path="workouts/:id/edit" element={<UpdateWorkout />} />
                    <Route path="*" element={<ErrorPage />} /> 
                </Route>
            </Routes>
        </Router>
    );
};

export default App;