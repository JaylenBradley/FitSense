import React from 'react';
import { LockOutlined, UserOutlined, GoogleOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';

const AuthForm = ({ isSignUp }) => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { username, email, password, confirmPassword } = values;

    if (isSignUp && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
        alert('Sign up successful!');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Sign in successful!');
      }
      navigate('/workouts');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert('Signed in with Google successfully!');
      navigate('/workouts');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Form
      name="auth"
      initialValues={{
        remember: true,
      }}
      style={{
        maxWidth: 360,
        margin: '0 auto',
      }}
      onFinish={onFinish}
    >
      {isSignUp && (
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
      )}
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your Email!',
          },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>
      {isSignUp && (
        <Form.Item
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: 'Please confirm your Password!',
            },
          ]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Confirm Password" />
        </Form.Item>
      )}
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
      </Form.Item>
      <Form.Item>
        <Button type="default" onClick={handleGoogleSignIn} style={{ width: '100%' }}>
          <GoogleOutlined /> Sign in with Google
        </Button>
      </Form.Item>
      {isSignUp && (
        <Form.Item>
          <Link to="/signin">Already have an account? Sign In</Link>
        </Form.Item>
      )}
      {!isSignUp && (
        <Form.Item>
          <Link to="/signup">Don't have an account? Sign Up</Link>
        </Form.Item>
      )}
    </Form>
  );
};

export default AuthForm;