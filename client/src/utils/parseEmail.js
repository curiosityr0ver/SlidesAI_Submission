

const parseEmail = (email) => {
    const from = email.payload.headers.find(
        (header) => header.name === "From"
    ).value;
    const fromSplit = splitEmailAndTitle(from);
    let sender;
    if (fromSplit) {
        sender = fromSplit.title + ": " + fromSplit.email;
    } else {
        sender = from;
    }
    const subject = email.payload.headers.find(
        (header) => header.name === "Subject"
    ).value;
    const body = email.snippet;
    return { sender, subject, body };
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

export default parseEmail;

