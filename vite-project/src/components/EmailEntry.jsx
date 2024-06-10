/* eslint-disable react/prop-types */

export default function EmailEntry({ email }) {
	const parseEmail = (email) => {
		const from = email.payload.headers.find(
			(header) => header.name === "From"
		).value;
		const fromSplit = splitEmailAndTitle(from);
		console.log(fromSplit.title + ": ");
		let fromTitle;
		if (fromSplit) {
			fromTitle = fromSplit.title;
		} else {
			fromTitle = from;
		}
		const subject = email.payload.headers.find(
			(header) => header.name === "Subject"
		).value;
		const body = email.snippet;
		return { fromTitle, subject, body };
	};
	function splitEmailAndTitle(input) {
		// Use regular expression to match the email and title parts
		const regex = /^(.*?)\s*<([^>]+)>$/;
		const match = input.match(regex);

		if (match) {
			return {
				title: match[1].trim(),
				email: match[2].trim(),
			};
		} else {
			return null; // or handle the case where input does not match the expected format
		}
	}

	if (email) {
		return (
			<li key={email.id}>
				<h3>{parseEmail(email).from}</h3>
				<p>{parseEmail(email).subject}</p>
				<p>{parseEmail(email).body}</p>
			</li>
		);
	} else {
		return <div>No email selected</div>;
	}
}
