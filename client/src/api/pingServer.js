import axios from "axios";

const BACKEND_URL_ORIGIN = import.meta.env.VITE_APP_SERVER_ORIGIN
    || "http://localhost:5000";

const pingServer = async (
    setLoadingPing,
    setError,
    setRandomQuote
) => {
    console.log(BACKEND_URL_ORIGIN);
    setLoadingPing(true);
    try {
        const response = await axios.get(`${BACKEND_URL_ORIGIN}/`);
        console.log("Response from server", response.data);
        setRandomQuote(response.data);
    } catch (err) {
        console.error("Error pinging server", err);
        setError(err);
    } finally {
        setLoadingPing(false);
    }
};

export default pingServer;