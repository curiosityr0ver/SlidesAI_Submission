/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import axios from "axios";
import EmailEntry from "./EmailEntry";

const EmailList = ({ setIsLoggedIn }) => {
	const [emails, setEmails] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchEmails = async () => {
			try {
				const response = await gapi.client.gmail.users.messages.list({
					userId: "me",
					maxResults: 2,
				});
				const messages = response.result.messages;

				if (messages) {
					const emailsData = await Promise.all(
						messages.map(async (message) => {
							const msg = await gapi.client.gmail.users.messages.get({
								userId: "me",
								id: message.id,
							});
							return msg.result;
						})
					);
					setEmails(emailsData);
				} else {
					setEmails([]);
				}
			} catch (err) {
				console.error("Error fetching emails", err);
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		if (gapi.client.gmail) {
			fetchEmails();
		} else {
			const interval = setInterval(() => {
				if (gapi.client.gmail) {
					clearInterval(interval);
					fetchEmails();
				}
			}, 100);
		}
	}, []);

	const classifyEmails = async (emails) => {
		const payload = emails.map((email) => {
			const from = email.payload.headers.find(
				(header) => header.name === "From"
			).value;
			const subject = email.payload.headers.find(
				(header) => header.name === "Subject"
			).value;
			const body = email.snippet;
			return { from, subject, body };
		});
		const response = await axios.post("http://localhost:5000/classify", {
			emails: payload,
		});
		console.log("Classified emails", response.data);
	};

	const pingServer = async () => {
		const response = await axios.get("http://localhost:5000/");
		console.log("Response from server", response.data);
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div>
			<h2>Last 10 Emails</h2>
			<button
				onClick={() => {
					gapi.auth2.getAuthInstance().signOut();
					setIsLoggedIn(false);
				}}
			>
				Logout
			</button>
			<button
				onClick={() => {
					classifyEmails(emails);
				}}
			>
				Classify Emails
			</button>
			<button
				onClick={() => {
					pingServer();
				}}
			>
				Test Server
			</button>
			<ul>
				{emails.map((email) => (
					<EmailEntry key={email.id} email={email} />
				))}
			</ul>
		</div>
	);
};

export default EmailList;
