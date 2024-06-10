
const helperFunction = async (
    setLoading,
    setEmails,
    setError,
    gapi,
) => {
    try {
        const response = await gapi.client.gmail.users.messages.list({
            userId: "me",
            maxResults: 10, // Changed to 10 for Last 10 Emails
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

function FetchEmails(gapi, setLoading, setEmails, setError) {
    if (gapi.client.gmail) {
        helperFunction(setLoading, setEmails, setError, gapi);
    } else {
        const interval = setInterval(() => {
            if (gapi.client.gmail) {
                clearInterval(interval);
                helperFunction(setLoading, setEmails, setError, gapi);
            }
        }, 100);
    }
}

export default FetchEmails;