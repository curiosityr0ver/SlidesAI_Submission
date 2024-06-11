import axios from "axios";

const pingServer = async (
    setLoadingPing,
    setError
) => {
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

export default pingServer;