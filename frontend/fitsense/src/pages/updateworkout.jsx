import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { Card, Button, Form, Input, Row, Col, Divider, Typography, Tag, Select, List, Spin } from 'antd';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const UpdateWorkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState("");
    const [description, setDescription] = useState("");
    const [notes, setNotes] = useState("");
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
                    setNotes(data.notes);
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
        if (!exerciseName || sets <= 0 || reps <= 0 || restTime < 0) {
            alert("Please enter a valid exercise name, # of sets, # of reps and a rest time");
            return;
        }

        const newExercise = { exerciseName, reps, sets, restTime };
        setDays({
            ...days,
            [currentDay]: [...days[currentDay], newExercise]
        });
        setExerciseName("");
        setReps("");
        setSets("");
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

    const handleSaveWorkout = async () => {
        const hasExercises = Object.values(days).some(day => day.length > 0);
        if (!hasExercises) {
            alert("Please add at least one exercise to the workout");
            return;
        }

        if (!name) {
            alert("Please enter a workout name");
            return;
        }

        const currentDate = new Date();

        try {
            await updateDoc(doc(workoutCollectionRef, id), {
                name,
                type,
                tags,
                description,
                notes,
                isFavorite,
                days,
                updatedAt: currentDate.toISOString()
            });
            alert("Workout updated successfully!");
            navigate(`/workouts/${id}`);
        } catch (err) {
            alert(err.message);
        }
    };

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    if (!name) {
        return <Spin tip="Loading..." />;
    }

    return (
        <Card style={{ margin: '24px' }}>
            <Title level={2}>Update Workout</Title>
            <Form layout="vertical">
                <Form.Item label="Workout Name" required>
                    <Input 
                        placeholder="Enter workout name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Workout Type" required>
                    <Input 
                        placeholder="Enter workout type" 
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Tags">
                    <Input
                        placeholder="Enter tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onPressEnter={handleAddTag}
                    />
                    <Button onClick={handleAddTag} style={{ marginTop: '8px' }}>Add Tag</Button>
                    <div style={{ marginTop: '8px' }}>
                        {tags.map((tag, index) => (
                            <Tag key={index} closable onClose={() => handleRemoveTag(tag)}>
                                {tag}
                            </Tag>
                        ))}
                    </div>
                </Form.Item>
                <Form.Item label="Description">
                    <TextArea 
                        placeholder="Enter description" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Notes">
                    <TextArea 
                        placeholder="Enter notes" 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <label>
                        Favorite:
                        <Input 
                            type="checkbox" 
                            checked={isFavorite}
                            onChange={(e) => setIsFavorite(e.target.checked)}
                        />
                    </label>
                </Form.Item>
                <Divider />
                <Form.Item label="Add Exercise">
                    <Select value={currentDay} onChange={(value) => setCurrentDay(value)} style={{ width: '100%' }}>
                        {daysOfWeek.map(day => (
                            <Option key={day} value={day}>{day}</Option>
                        ))}
                    </Select>
                    <Input 
                        placeholder="Enter exercise name" 
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                        style={{ marginTop: '8px' }}
                    />
                    <Input 
                        placeholder="Enter sets" 
                        type="number" 
                        value={sets}
                        onChange={(e) => setSets(e.target.value < 0 ? "" : parseInt(e.target.value))}
                        style={{ marginTop: '8px' }}
                    />
                    <Input 
                        placeholder="Enter reps" 
                        type="number" 
                        value={reps}
                        onChange={(e) => setReps(e.target.value < 0 ? "" : parseInt(e.target.value))}
                        style={{ marginTop: '8px' }}
                    />
                    <Input 
                        placeholder="Enter rest time" 
                        type="number" 
                        value={restTime}
                        onChange={(e) => setRestTime(e.target.value < 0 ? "" : parseInt(e.target.value))}
                        style={{ marginTop: '8px' }}
                    />
                    <Button onClick={handleAddExercise} style={{ marginTop: '8px' }}>Add Exercise</Button>
                </Form.Item>
                <Divider />
                <Title level={3}>Exercises</Title>
                {daysOfWeek.map(day => (
                    <div key={day}>
                        <Title level={4}>{day}</Title>
                        <List
                            bordered
                            dataSource={days[day] || []}
                            renderItem={(exercise, index) => (
                                <List.Item key={index}>
                                    {exercise.exerciseName}: {exercise.sets} {parseInt(exercise.sets) === 1 ? "set" : "sets"} x {exercise.reps} {parseInt(exercise.reps) === 1 ? "rep" : "reps"} - rest {exercise.restTime} {parseInt(exercise.restTime) === 1 ? "minute" : "minutes"}
                                    <Button type="link" onClick={() => handleRemoveExercise(day, index)}>Remove</Button>
                                </List.Item>
                            )}
                        />
                    </div>
                ))}
                <Divider />
                <Row gutter={16}>
                    <Col>
                        <Button type="primary" onClick={handleSaveWorkout}>Save Workout</Button>
                    </Col>
                    <Col>
                        <Button onClick={() => navigate('/workouts')}>Cancel</Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    );
};

export default UpdateWorkout;