import React, { useRef, useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthProvider } from 'firebase/auth';
import { FacebookAuthProvider } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

export default function Login() {
	const emailRef = useRef();
	const passwordRef = useRef();
	const { emailLogin, signInWithProvider } = useAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	async function handleSubmit(event) {
		event.preventDefault();

		try {
			setError('');
			setLoading(true);
			await emailLogin(emailRef.current.value, passwordRef.current.value);
			navigate('/');
		} catch (error) {
			console.log(error);
			setError('Failed to login');
		}
		setLoading(false);
	}
	async function handleGoogleLogin() {
		const provider = new GoogleAuthProvider();
		try {
			setError('');
			setLoading(true);
			await signInWithProvider(provider);
			navigate('/');
		} catch (error) {
			console.log(error);
			setError('Failed to login');
		}
		setLoading(false);
	}
	async function handleFacebookLogin() {
		const provider = new FacebookAuthProvider();
		try {
			setError('');
			setLoading(true);
			await signInWithProvider(provider);
			navigate('/');
		} catch (error) {
			console.log(error);
			setError('Failed to login');
		}
		setLoading(false);
	}

	return (
		<div>
			<Card>
				<Card.Body>
					<h2 className="text-center mb-4">Login</h2>
					{error && <Alert variant="danger">{error}</Alert>}
					<Form onSubmit={handleSubmit}>
						<Form.Group id="email">
							<Form.Label>Email</Form.Label>
							<Form.Control
								type="email"
								ref={emailRef}
								required
							/>
						</Form.Group>
						<Form.Group id="password">
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								ref={passwordRef}
								required
							/>
						</Form.Group>
						<div className="d-flex justify-content-center align-items-center flex-wrap">
							<img
								alt="Facebook Login"
								style={{ margin: '20px' }}
								width="50px"
								src="login_buttons/facebook_login.png"
								onClick={handleFacebookLogin}
							/>
							<img
								alt="Google Login"
								style={{ margin: '20px' }}
								width="50px"
								src="login_buttons/google_login.png"
								onClick={handleGoogleLogin}
							/>
						</div>
						<Button
							disabled={loading}
							className="w-100 mt-3"
							type="submit">
							Login
						</Button>
					</Form>
				</Card.Body>
			</Card>
			<div className="w-100 text-center mt-2">
				Need an account? <Link to="/signup">Sign Up</Link>
			</div>
		</div>
	);
}
