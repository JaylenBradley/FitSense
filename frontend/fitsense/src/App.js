import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase';
import Layout from './containers/layout';
import Home from './pages/home';
import DefaultHome from './pages/defaulthome';
import AuthForm from './containers/form';
import Workouts from './pages/workouts';
import CreateWorkout from './pages/createworkout';
import WorkoutDetails from './components/workoutDetails';
import UpdateWorkout from './pages/updateworkout';
import MealPlan from './pages/mealplan';
import CreateMealPlan from './pages/createmealplan';
import UpdateMealPlan from './pages/updatemealplan';
import ErrorPage from './pages/errorpage';

const PrivateRoute = ({ children }) => {
    const [user] = useAuthState(auth);
    return user ? children : <Navigate to="/signin" />;
};

const PublicRoute = ({ children }) => {
    const [user] = useAuthState(auth);
    return !user ? children : <Navigate to="/home" />;
};

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={
                    <PublicRoute>
                        <DefaultHome />
                    </PublicRoute>
                } />
                <Route element={<Layout />}>
                    <Route path="home" element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    } />
                    <Route path="workouts" element={
                        <PrivateRoute>
                            <Workouts />
                        </PrivateRoute>
                    } />
                    <Route path="create-workout" element={
                        <PrivateRoute>
                            <CreateWorkout />
                        </PrivateRoute>
                    } />
                    <Route path="workout/:id" element={
                        <PrivateRoute>
                            <WorkoutDetails />
                        </PrivateRoute>
                    } />
                    <Route path="workout/:id/edit" element={
                        <PrivateRoute>
                            <UpdateWorkout />
                        </PrivateRoute>
                    } />
                    <Route path="meal-plans" element={
                        <PrivateRoute>
                            <MealPlan />
                        </PrivateRoute>
                    } />
                    <Route path="create-meal-plan" element={
                        <PrivateRoute>
                            <CreateMealPlan />
                        </PrivateRoute>
                    } />
                    <Route path="meal-plan/:id/edit" element={
                        <PrivateRoute>
                            <UpdateMealPlan />
                        </PrivateRoute>
                    } />                   
                </Route>
                <Route path="signin" element={
                    <PublicRoute>
                        <AuthForm isSignUp={false} />
                    </PublicRoute>
                } />
                <Route path="signup" element={
                    <PublicRoute>
                        <AuthForm isSignUp={true} />
                    </PublicRoute>
                } />
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
    );
};

export default App;