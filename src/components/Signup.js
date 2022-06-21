import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { GoogleAuthProvider } from 'firebase/auth';
import { FacebookAuthProvider } from 'firebase/auth';
import { db } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

export default function Signup() {
	const { emailSignup, signInWithProvider, currentUser } = useAuth();
	const [firstName, setFirstName] = useState('');
	const [middleName, setMiddleName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [nationalID, setNationalID] = useState('');
	const [emailAddress, setEmailAddress] = useState('');
	const [address1, setAddress1] = useState('');
	const [address2, setAddress2] = useState('');
	const [linkedinProfile, setLinkedinProfile] = useState('');
	const [twitterProfile, setTwitterProfile] = useState('');
	const [facebookProfile, setFacebookProfile] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [courses, setCourses] = useState([
		{
			id: 1,
			title: 'English Course',
		},
		{
			id: 2,
			title: 'German Course',
		},
		{
			id: 3,
			title: 'French Course',
		},
		{
			id: 4,
			title: 'Arabic Course',
		},
	]);
	const [course, setCourse] = useState();
	const [providerID, setProviderID] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [disableEmailChange, setDisableEmailChange] = useState(false);

	const navigate = useNavigate();

	async function handleSubmit(event) {
		event.preventDefault();
		setError('');
		setLoading(true);
		const isFirstNameNotValid = !(firstName.length > 3);
		const isMiddleNameNotValid = !(middleName.length > 3);
		const isLastNameNotValid = !(lastName.length > 3);
		const isEmailNotValid = !(emailAddress.length > 3);
		const isPhoneNumberNotValid = !(phoneNumber.length === 14);
		const isNationalIDNotValid = !(nationalID.length === 14);
		const isAddress1NotValid = !(address1.length > 3);
		const isCourseNotValid = !course.length;
		try {
			if (isFirstNameNotValid) {
				throw Error('Please enter a valid First Name');
			}
			if (isMiddleNameNotValid) {
				throw Error('Please enter a valid First Name');
			}
			if (isLastNameNotValid) {
				throw Error('Please enter a valid Last Name');
			}
			if (isEmailNotValid) {
				throw Error('Please enter a valid Email');
			}
			if (isPhoneNumberNotValid) {
				console.log(phoneNumber.length);
				throw Error('Please enter a valid Phone Number');
			}
			if (isNationalIDNotValid) {
				throw Error('Please enter a valid National ID');
			}
			if (isAddress1NotValid) {
				throw Error('Please enter a valid Address');
			}
			if (isCourseNotValid) {
				throw Error('Please enter a valid Course');
			}
			if (providerID.length === 0) {
				const isPasswordNotValid = !(password.length > 6);
				if (isPasswordNotValid || password !== passwordConfirm) {
					throw Error('Please enter correct data');
				}
				const checkExist = new Promise((resolve, reject) => {
					db.collection('users')
						.where('emailAddress', '==', emailAddress)
						.get()
						.then((querySnapshot) => {
							resolve(querySnapshot.size > 0);
						})
						.catch((e) => {
							reject(false);
						});
				});
				const userExists = await checkExist;
				if (!userExists) {
					await emailSignup(emailAddress, password);
				} else {
					throw Error('User Already Exists');
				}
			}
			const saveUser = new Promise((resolve, reject) => {
				db.collection('users')
					.add({
						firstName,
						middleName,
						lastName,
						phoneNumber,
						nationalID,
						emailAddress,
						address1,
						address2,
						linkedinProfile,
						twitterProfile,
						facebookProfile,
						course,
						providerID,
					})
					.then((_) => {
						resolve('User created successfully');
					})
					.catch((error) => {
						reject('Error adding User: ', error);
					});
			});
			await saveUser;
			setLoading(false);
			navigate('/');
		} catch (e) {
			console.log(e);
			setLoading(false);
			setError(e.message);
		}
	}

	async function handleGoogleLogin() {
		const provider = new GoogleAuthProvider();
		provider.addScope('https://www.googleapis.com/auth/userinfo.email');
		try {
			setError('');
			setLoading(true);
			const userData = await signInWithProvider(provider);
			setProviderID('google.com');
			setEmailAddress(userData.additionalUserInfo.profile.email);
			setFirstName(userData.additionalUserInfo.profile.given_name);
			setLastName(userData.additionalUserInfo.profile.family_name);
			const checkExist = new Promise((resolve, reject) => {
				db.collection('users')
					.where(
						'emailAddress',
						'==',
						userData.additionalUserInfo.profile.email
					)
					.get()
					.then((querySnapshot) => {
						console.log(querySnapshot);
						resolve(querySnapshot.size > 0);
					})
					.catch((e) => {
						reject(false);
					});
			});
			if (userData.additionalUserInfo.profile.email) {
				setDisableEmailChange(true);
			}
			const userExists = await checkExist;
			if (userExists) {
				navigate('/');
			}
		} catch (error) {
			setProviderID('');
			setError('Failed to login');
		}
		setLoading(false);
	}

	async function handleFacebookLogin() {
		const provider = new FacebookAuthProvider();
		try {
			setError('');
			setLoading(true);
			const userData = await signInWithProvider(provider);
			setProviderID('facebook.com');
			setEmailAddress(userData.user.providerData[0].email);
			setFirstName(userData.additionalUserInfo.profile.first_name);
			setLastName(userData.additionalUserInfo.profile.last_name);
			const checkExist = new Promise((resolve, reject) => {
				db.collection('users')
					.where(
						'emailAddress',
						'==',
						userData.user.providerData[0].email
					)
					.get()
					.then((querySnapshot) => {
						resolve(querySnapshot.size > 0);
					})
					.catch((e) => {
						reject(false);
					});
			});
			if (userData.user.providerData[0].email) {
				setDisableEmailChange(true);
			}
			const userExists = await checkExist;
			if (userExists) {
				navigate('/');
			}
		} catch (error) {
			setProviderID('');
			setError('Failed to login');
		}
		setLoading(false);
	}
	return (
		<div>
			<Card>
				<Card.Body>
					{!currentUser ? (
						<h2 className="text-center mb-4">Sign Up</h2>
					) : (
						<h4 className="text-center mb-4">
							Please Continue Filling Up Your Data
						</h4>
					)}
					{error && <Alert variant="danger">{error}</Alert>}
					<Form>
						<Form.Group id="f-name">
							<Form.Label>First Name</Form.Label>
							<Form.Control
								type="text"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group id="m-name">
							<Form.Label>Middle Name</Form.Label>
							<Form.Control
								type="text"
								onChange={(e) => setMiddleName(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group id="l-name">
							<Form.Label>Last Name</Form.Label>
							<Form.Control
								type="text"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group id="phone-number">
							<Form.Label>Phone Number</Form.Label>
							<Form.Control
								type="number"
								onChange={(e) => setPhoneNumber(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group id="national-id">
							<Form.Label>National ID</Form.Label>
							<Form.Control
								type="number"
								onChange={(e) => setNationalID(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group id="email">
							<Form.Label>Email</Form.Label>
							<Form.Control
								disabled={disableEmailChange}
								type="email"
								value={emailAddress}
								onChange={(e) =>
									setEmailAddress(e.target.value)
								}
								required
							/>
						</Form.Group>
						<Form.Group id="address1">
							<Form.Label>Address 1</Form.Label>
							<Form.Control
								type="text"
								onChange={(e) => setAddress1(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group id="address2">
							<Form.Label>Address 2</Form.Label>
							<Form.Control
								type="text"
								onChange={(e) => setAddress2(e.target.value)}
								required
							/>
						</Form.Group>
						<Form.Group id="linkedin-profile">
							<Form.Label>Linkedin</Form.Label>
							<Form.Control
								type="text"
								onChange={(e) =>
									setLinkedinProfile(e.target.value)
								}
								required
							/>
						</Form.Group>
						<Form.Group id="twitter-profile">
							<Form.Label>Twitter</Form.Label>
							<Form.Control
								type="text"
								onChange={(e) =>
									setTwitterProfile(e.target.value)
								}
								required
							/>
						</Form.Group>
						<Form.Group id="facebook-profile">
							<Form.Label>Facebook</Form.Label>
							<Form.Control
								type="text"
								onChange={(e) =>
									setFacebookProfile(e.target.value)
								}
								required
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label>Course</Form.Label>
							<Form.Select
								aria-label="Default select example"
								onChange={(e) => setCourse(e.target.value)}>
								{courses.map((course) => {
									return (
										<option
											key={course.id}
											value={course.title}>
											{course.title}
										</option>
									);
								})}
							</Form.Select>
						</Form.Group>
						{!currentUser ? (
							<div>
								<Form.Group id="password">
									<Form.Label>Password</Form.Label>
									<Form.Control
										type="password"
										onChange={(e) =>
											setPassword(e.target.value)
										}
										required
									/>
								</Form.Group>
								<Form.Group id="password-confirm">
									<Form.Label>
										Password Confirmation
									</Form.Label>
									<Form.Control
										type="password"
										onChange={(e) =>
											setPasswordConfirm(e.target.value)
										}
										required
									/>
								</Form.Group>
							</div>
						) : null}
						{providerID === '' ? (
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
						) : null}

						<Button
							disabled={loading}
							className="w-100 mt-3"
							type="submit"
							onClick={handleSubmit}>
							{providerID === '' ? 'Sign Up' : 'Complete'}
						</Button>
					</Form>
				</Card.Body>
			</Card>
			<div className="w-100 text-center mt-2">
				Already have an account? <Link to="/login">Login</Link>
			</div>
		</div>
	);
}
