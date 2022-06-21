import React, { useState } from 'react';
import { Form, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function EnrollSuccess() {
	const countryCode = '+2';
	const { currentUser, logout, generateRecaptcha, auth } = useAuth();
	const [phoneNumber, setPhoneNumber] = useState('+201091101387');
	const [OTP, setOTP] = useState('');
	const [confirmOTP, setConfirmOTP] = useState('');
	const [error, setError] = useState('');
	const [ValidOTP, setValidOTP] = useState(false);
	const [flag, setFlag] = useState(false);
	const navigate = useNavigate();

	async function handleLogout() {
		setError('');
		try {
			await logout();
			navigate('/login');
		} catch (error) {
			setError('Failed to logout');
		}
	}

	const requestOTP = async (e) => {
		console.log(currentUser);
		e.preventDefault();
		setFlag(true);
		setError('');
		if (phoneNumber.length !== 13)
			return setError('Please enter a valid Phone Number');
		try {
			const response = await generateRecaptcha(phoneNumber);
			console.log(response);
			setConfirmOTP(response);
		} catch (e) {
			setError(e.message);
			console.log(e.message);
		}
	};

	const verifyOTP = async (e) => {
		e.preventDefault();
		if (OTP === '' || OTP === null) return;
		try {
			setError('');
			await confirmOTP.confirm(OTP);
			auth.updateUser(currentUser.uid, {
				phoneNumber: '+11234567890',
				emailVerified: true,
			})
				.then((userRecord) => {
					// See the UserRecord reference doc for the contents of userRecord.
					console.log(
						'Successfully updated user',
						userRecord.toJSON()
					);
				})
				.catch((error) => {
					console.log('Error updating user:', error);
				});
			console.log('otp: ' + OTP + ' ' + 'confirm: ' + confirmOTP);
			setValidOTP(true);
		} catch {
			setError('The Code you entered is not right');
		}
	};

	if (ValidOTP) {
		return (
			<div>
				<Card>
					<Card.Body>
						<h2 className="text-center mb-4">
							You have been successfully enrolled
						</h2>
						{error && <Alert variant="danger">{error}</Alert>}
						<strong>Email: </strong>
						{currentUser.providerData[0].email}
						<Button variant="link" onClick={handleLogout}>
							Logout
						</Button>
					</Card.Body>
				</Card>
				<div className="w-100 text-center mt-2">
					<div id="recaptcha-container"></div>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<Card>
					<Card.Body>
						<p
							className="text-center mb-4"
							style={{ display: !flag ? 'none' : 'block' }}>
							Enter the code that you recieved on your phone
						</p>
						<p
							className="text-center mb-4"
							style={{ display: flag ? 'none' : 'block' }}>
							Send a Verification Code to your Phone
						</p>
						{error && <Alert variant="danger">{error}</Alert>}
						<Form onSubmit={verifyOTP}>
							<Form.Group id="send-otp">
								<Button
									style={{ display: flag ? 'none' : 'block' }}
									className="w-100 mb-2"
									onClick={requestOTP}>
									Send OTP
								</Button>
							</Form.Group>
							<Form.Group
								id="otp"
								style={{ display: !flag ? 'none' : 'block' }}>
								<Form.Control
									type="text"
									onChange={(e) => setOTP(e.target.value)}
									placeholder="Enter OTP"
									required
								/>
								<div
									id="recaptcha-container"
									className="mt-3"></div>
							</Form.Group>
							<Button
								style={{ display: !flag ? 'none' : 'block' }}
								className="w-100 mt-3"
								type="submit">
								Continue
							</Button>
						</Form>
						<Button variant="link" onClick={handleLogout}>
							Logout
						</Button>
					</Card.Body>
				</Card>
			</div>
		);
	}
}
