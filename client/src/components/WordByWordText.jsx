// src/WordByWordText.js

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./WordByWordText.module.css";

const WordByWordText = ({
	text = "",
	details = "gemini-1.5-flash-latest",
	interval = 500,
}) => {
	const [displayedText, setDisplayedText] = useState("");

	useEffect(() => {
		// Reset state when text prop changes
		setDisplayedText("");

		const words = text.split(" ");
		let index = 0;

		const timer = setInterval(() => {
			if (index < words.length) {
				setDisplayedText((prev) =>
					prev ? `${prev} ${getWord(index)}` : getWord(index)
				);
				index++;
			} else {
				clearInterval(timer);
			}
		}, interval);

		return () => clearInterval(timer);
	}, [text, interval]);

	const getWord = (index) => {
		const words = text.split(" ");
		if (index < words.length) {
			return words[index];
		} else {
			return "";
		}
	};

	return (
		<div className={styles.quoteContainer}>
			<div className={styles.wordByWordText}>{displayedText}</div>
			{details && <div className={styles.details}>{details}</div>}
		</div>
	);
};

WordByWordText.propTypes = {
	text: PropTypes.string,
	details: PropTypes.string,
	interval: PropTypes.number,
};

export default WordByWordText;
