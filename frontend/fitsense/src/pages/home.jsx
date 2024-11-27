import React from "react";
import { Card, Col, Row, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';

const { Title, Paragraph } = Typography;

const Home = () => {
    const [user] = useAuthState(auth);

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Welcome to FitSense</Title>
            <Paragraph style={{ textAlign: 'center' }}>
                Your ultimate fitness companion. Track your workouts, set goals, and achieve your fitness dreams with FitSense.
            </Paragraph>

            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col xs={24} sm={12} md={8}>
                    <Card
                        title="Track Workouts"
                        bordered={false}
                        cover={<AppstoreOutlined style={{ fontSize: '48px', color: '#1890ff', textAlign: 'center', padding: '24px' }} />}
                    >
                        <Paragraph>
                            Keep track of your workouts and monitor your progress over time. Stay motivated and reach your fitness goals.
                        </Paragraph>
                        <Button type="primary" block>
                            <Link to="/workouts">View Workouts</Link>
                        </Button>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card
                        title="Create Workouts"
                        bordered={false}
                        cover={<PlusOutlined style={{ fontSize: '48px', color: '#1890ff', textAlign: 'center', padding: '24px' }} />}
                    >
                        <Paragraph>
                            Design your own workout plans tailored to your needs. Customize exercises, sets, and reps to fit your routine.
                        </Paragraph>
                        <Button type="primary" block>
                            <Link to="/create">Create Workout</Link>
                        </Button>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card
                        title="Stay Motivated"
                        bordered={false}
                        cover={<HomeOutlined style={{ fontSize: '48px', color: '#1890ff', textAlign: 'center', padding: '24px' }} />}
                    >
                        <Paragraph>
                            Join our community and stay motivated with tips, challenges, and support from fellow fitness enthusiasts.
                        </Paragraph>
                        <Button type="primary" block>
                            <Link to="/community">Join Community</Link>
                        </Button>
                    </Card>
                </Col>
            </Row>

            {!user && (
                <div style={{ textAlign: 'center', marginTop: '48px' }}>
                    <Title level={3}>Ready to get started?</Title>
                    <Button type="primary" size="large">
                        <Link to="/signup">Sign Up Now</Link>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Home;