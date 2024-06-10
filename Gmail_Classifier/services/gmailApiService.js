const { google } = require('googleapis');

async function listOflabels(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.labels.list({
        userId: 'me',
    });
    const labels = res.data.labels;
    if (labels && labels.length > 0) {
        console.log('Labels:');
        labels.forEach((label) => {
            console.log(`- ${label.name}`);
        });
        return labels;
    } else {
        console.log('No labels found.');
        return;
    }
}

async function getMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 1,
    });

    let latestMessageId = res.data.messages[0].id;

    const messageContent = await gmail.users.messages.get({
        userId: 'me',
        id: latestMessageId,
    });

    const body = JSON.stringify(messageContent.data.payload.body.data);
    let buff = new Buffer.from(body, 'base64').toString();
    return buff;
}

module.exports = { listOflabels, getMessages };