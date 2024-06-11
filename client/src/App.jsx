import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import EmailList from "./components/EmailList";

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	return (
		<div className="App">
			<header className="App-header">
				<h1>Email Classifier</h1>
				{!isLoggedIn ? (
					<Login setIsLoggedIn={setIsLoggedIn} />
				) : (
					<EmailList setIsLoggedIn={setIsLoggedIn} />
				)}
			</header>
		</div>
	);
}

export default App;
