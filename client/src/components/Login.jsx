/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { gapi } from "gapi-script";

const Login = ({ setIsLoggedIn }) => {
	const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GMAIL_CLIENT_ID;
	useEffect(() => {
		const initClient = () => {
			gapi.client
				.init({
					clientId: GOOGLE_CLIENT_ID,
					scope: "https://www.googleapis.com/auth/gmail.readonly",
				})
				.then(
					() => {
						gapi.client.load("gmail", "v1", () => {
							console.log("Gmail API loaded");
						});
					},
					(error) => {
						console.error("Error initializing GAPI client", error);
					}
				);
		};
		gapi.load("client:auth2", initClient);
	}, []);

	const handleLogin = () => {
		gapi.auth2
			.getAuthInstance()
			.signIn()
			.then(
				() => {
					console.log("User signed in");
					setIsLoggedIn(true);
				},
				(error) => {
					console.error("Error signing in", error);
				}
			);
	};

	return <button onClick={handleLogin}>Login with Google</button>;
};

export default Login;
