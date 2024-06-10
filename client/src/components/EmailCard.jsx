/* eslint-disable react/prop-types */
// src/EmailCard.js

import styles from "./EmailCard.module.css";

const EmailCard = ({ email, classification }) => {
	console.log(classification);
	const { sender, subject, body } = email;
	return (
		<div className={styles.emailCard}>
			<div className={styles.emailHeader}>
				<span className={styles.emailSender}>{sender}</span>
				<div className={styles.classifications}>
					{classification.map((classification, index) => (
						<span
							key={index}
							className={`${styles.emailClassification} ${
								styles[classification.toLowerCase()]
							}`}
						>
							{classification}
						</span>
					))}
				</div>
			</div>
			<div className={styles.emailSubject}>{subject}</div>
			<div className={styles.emailBody}>{body}</div>
		</div>
	);
};

export default EmailCard;
