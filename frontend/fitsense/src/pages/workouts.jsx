import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { db, auth } from '../config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Card, Typography, Spin, Row, Col, Button, Tag } from 'antd'; // Import Ant Design components

const { Title, Paragraph } = Typography;

const Workouts = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Memoize the collection reference
    const workoutCollectionRef = useMemo(() => collection(db, 'workout-programs'), []);

    useEffect(() => {
        const fetchWorkouts = async (user) => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const q = query(workoutCollectionRef, where('userId', '==', user.uid));
                const data = await getDocs(q);
                const fetchedWorkouts = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setWorkouts(fetchedWorkouts);
            } catch (err) {
                console.error('Error getting workouts: ', err);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            fetchWorkouts(user);
        });

        return () => unsubscribe();
    }, [workoutCollectionRef]);

    if (loading) {
        return <Spin tip="Loading..." />;
    }

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>Your Workouts</Title>
            {workouts.length === 0 ? (
                <Paragraph>No workouts found</Paragraph>
            ) : (
                <Row gutter={[16, 16]}>
                    {workouts.map((workout) => (
                        <Col xs={24} sm={12} md={8} key={workout.id}>
                            <Card
                                title={workout.name}
                                bordered={false}
                                style={{ backgroundColor: workout.isFavorite ? '#fffbe6' : 'white' }}
                                extra={<Link to={`/workouts/${workout.id}`}>View workout</Link>}
                            >
                                <Paragraph>{workout.description}</Paragraph>
                                {workout.tags && workout.tags.length > 0 && (
                                    <Paragraph>
                                        Tags: {workout.tags.map(tag => (
                                            <Tag key={tag}>{tag}</Tag>
                                        ))}
                                    </Paragraph>
                                )}
                                {workout.type && <Paragraph>Type: {workout.type}</Paragraph>}
                                {workout.notes && <Paragraph>Notes: {workout.notes}</Paragraph>}
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Button type="primary">
                    <Link to="/create">Create New Workout</Link>
                </Button>
            </div>
        </div>
    );
};

export default Workouts;