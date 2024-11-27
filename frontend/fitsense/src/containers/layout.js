import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Button, Breadcrumb, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, AppstoreOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const { Header, Sider, Content, Footer } = AntLayout;

const Layout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
                setUserName(user.displayName || user.email);
            } else {
                setIsAuthenticated(false);
                setUserName('');
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        const confirmed = window.confirm("Are you sure you want to log out?");
        if (!confirmed) {
            return;
        }

        try {
            await signOut(auth);
            alert("You have been logged out.");
            navigate('/signin');
        } catch (err) {
            console.error("Error logging out: ", err);
            alert("Error logging out: " + err.message);
        }
    };

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const breadcrumbItems = location.pathname.split('/').filter(i => i).map((path, index) => (
        <Breadcrumb.Item key={index}>
            <Link to={`/${path}`}>{path.charAt(0).toUpperCase() + path.slice(1)}</Link>
        </Breadcrumb.Item>
    ));

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        !isAuthenticated
                            ? {
                                  key: '1',
                                  icon: <UserOutlined />,
                                  label: <Link to="/signin">Login</Link>,
                              }
                            : {
                                  key: '1',
                                  icon: <UserOutlined />,
                                  label: 'Logout',
                                  onClick: handleLogout,
                              },
                        {
                            key: '2',
                            icon: <HomeOutlined />,
                            label: <Link to="/">Home</Link>,
                        },
                        {
                            key: '3',
                            icon: <AppstoreOutlined />,
                            label: <Link to="/workouts">Workouts</Link>,
                        },
                        {
                            key: '4',
                            icon: <PlusOutlined />,
                            label: <Link to="/create">Create Workout</Link>,
                        },
                    ]}
                />
            </Sider>
            <AntLayout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <h1 style={{ margin: 0 }}>FitSense</h1>
                    </div>
                    {isAuthenticated && <span style={{ marginRight: '16px' }}>Hello, {userName}</span>}
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Breadcrumb style={{ marginBottom: '16px' }}>
                        <Breadcrumb.Item>
                            <Link to="/">Home</Link>
                        </Breadcrumb.Item>
                        {breadcrumbItems}
                    </Breadcrumb>
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    FitSense ©2024 Created by Jaylen Bradley
                </Footer>
            </AntLayout>
        </AntLayout>
    );
};

export default Layout;