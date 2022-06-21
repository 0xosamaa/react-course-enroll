import React from 'react';
import Signup from './Signup';
import { Container } from 'react-bootstrap';
import { AuthProvider } from '../contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnrollSuccess from './EnrollSuccess';
import Login from './Login';
import {PrivateHome, PrivateAuth} from './PrivateRoute';

function App() {
	return (
		<Container className="d-flex align-items-center justify-content-center">
			<div className="w-100 my-4" style={{ maxWidth: '500px' }}>
				<Router>
					<AuthProvider>
						<Routes>
							<Route
								exact
								path="/"
								element={
									<PrivateHome>
										<EnrollSuccess />
									</PrivateHome>
								}
							/>
							<Route
								path="/signup"
								element={
									<PrivateAuth>
										<Signup />
									</PrivateAuth>
								}
							/>
							<Route
								path="/login"
								element={
									<PrivateAuth>
										<Login />
									</PrivateAuth>
								}
							/>
						</Routes>
					</AuthProvider>
				</Router>
			</div>
		</Container>
	);
}

export default App;
