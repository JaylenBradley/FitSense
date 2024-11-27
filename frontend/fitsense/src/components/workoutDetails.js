import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Card, Button, Typography, List, Divider, Row, Col, Tag, Spin } from 'antd';

const { Title, Paragraph } = Typography;

const WorkoutDetails = () => {
    const { id } = useParams();
    const [workout, setWorkout] = useState(null);
    const navigate = useNavigate();

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
            }
        };

        fetchWorkout();
    }, [workoutDocRef]);

    if (!workout) {
        return <Spin tip="Loading..." />;
    }

    const formattedDate = new Date(workout.createdAt).toLocaleDateString();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return (
        <Card style={{ margin: '24px' }}>
            <Title level={2}>{workout.name}</Title>
            <Paragraph>Created: {formattedDate}</Paragraph>
            {workout.tags && workout.tags.length > 0 && (
                <Paragraph>
                    Tags: {workout.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </Paragraph>
            )}
            {workout.type && <Paragraph>Type: {workout.type}</Paragraph>}
            {workout.description && <Paragraph>Description: {workout.description}</Paragraph>}
            {workout.notes && <Paragraph>Notes: {workout.notes}</Paragraph>}
            <Divider />
            <Title level={3}>Exercises</Title>
            {daysOfWeek.map(day => (
                <div key={day}>
                    <Title level={4}>{day}</Title>
                    <List
                        bordered
                        dataSource={workout.days[day] || []}
                        renderItem={(exercise, index) => (
                            <List.Item key={index}>
                                {exercise.exerciseName}: {exercise.sets} {parseInt(exercise.sets) === 1 ? "set" : "sets"} x {exercise.reps} {parseInt(exercise.reps) === 1 ? "rep" : "reps"} - rest {exercise.restTime} {parseInt(exercise.restTime) === 1 ? "minute" : "minutes"}
                            </List.Item>
                        )}
                    />
                </div>
            ))}
            <Divider />
            <Row gutter={16}>
                <Col>
                    <Button type="primary" onClick={() => navigate(`/workouts/${id}/edit`)}>Edit Workout</Button>
                </Col>
                <Col>
                    <Button type="text" danger onClick={deleteWorkout}>Delete Workout</Button>
                </Col>
            </Row>
        </Card>
    );
};

export default WorkoutDetails;