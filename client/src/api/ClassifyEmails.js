import axios from "axios";

const BACKEND_URL_ORIGIN = import.meta.env.VITE_APP_SERVER_ORIGIN
    || "http://localhost:5000";


const classifyEmails = async (
    emails,
    setLoadingClassify,
    setClassifications,
    setError,
) => {
    setLoadingClassify(true);
    try {
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
        const response = await axios.post(`${BACKEND_URL_ORIGIN}/classify`, {
            emails: payload,
        });
        setClassifications(response.data);
    } catch (err) {
        console.error("Error classifying emails", err);
        setError(err);
    } finally {
        setLoadingClassify(false);
    }
};

export default classifyEmails;