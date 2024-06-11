/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { gapi } from "gapi-script";
import axios from "axios";
import parseEmail from "../utils/parseEmail";
import EmailCard from "./EmailCard";
import FetchEmails from "../api/fetchEmails";
import classifyEmails from "../api/ClassifyEmails";

const EmailList = ({ setIsLoggedIn }) => {
	const [emails, setEmails] = useState([]);
	const [classifications, setClassifications] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingClassify, setLoadingClassify] = useState(false);
	const [loadingPing, setLoadingPing] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		FetchEmails(gapi, setLoading, setEmails, setError);
	}, []);

	const getClassifications = (index) => {
		if (classifications.length > 0) {
			return classifications[index].split(",").map((classification) => {
				return classification.trim();
			});
		}
		return ["UNCATEGORIZED"];
	};

	const pingServer = async () => {
		setLoadingPing(true);
		try {
			const response = await axios.get("http://localhost:5000/");
			console.log("Response from server", response.data);
		} catch (err) {
			console.error("Error pinging server", err);
			setError(err);
		} finally {
			setLoadingPing(false);
		}
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
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-around",
					width: "50%",
					margin: "auto",
				}}
			>
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
						classifyEmails(
							emails,
							setLoadingClassify,
							setClassifications,
							setError,
							axios
						);
					}}
					disabled={loadingClassify}
				>
					{loadingClassify ? "Classifying..." : "Classify Emails"}
				</button>
				<button
					onClick={() => {
						pingServer();
					}}
					disabled={loadingPing}
				>
					{loadingPing ? "Pinging..." : "Test Server"}
				</button>
			</div>
			<ul>
				{emails.map((email, index) => (
					<EmailCard
						key={email.id}
						email={parseEmail(email)}
						classification={getClassifications(index)}
					/>
				))}
			</ul>
		</div>
	);
};

export default EmailList;
