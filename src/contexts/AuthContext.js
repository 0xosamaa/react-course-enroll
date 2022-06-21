import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const AuthContext = React.createContext();

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState();
	const [loading, setLoading] = useState(true);

	function emailSignup(email, password) {
		return auth.createUserWithEmailAndPassword(email, password);
	}

	function emailLogin(email, password) {
		return auth.signInWithEmailAndPassword(email, password);
	}
	function logout() {
		return auth.signOut();
	}
	function signInWithProvider(provider) {
		return auth.signInWithPopup(provider);
	}

	function generateRecaptcha(phoneNumber) {
		const recaptchaVerifier = new RecaptchaVerifier(
			'recaptcha-container',
			{'size': 'invisible'},
			auth
		);
		recaptchaVerifier.render();
		return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setLoading(false);
		});
		return unsubscribe;
	}, []);

	const value = {
		currentUser,
		emailSignup,
		emailLogin,
		signInWithProvider,
		generateRecaptcha,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
}
