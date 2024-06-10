const fs = require('fs');
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');

//Define the scopes for the Gmail API

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];

//Fetch and store token from files

const TOKEN_PATH = path.join(process.cwd(), './credentials/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './credentials/credentials2.json');

// Read previously authorized credentials from a file, or request authorization if none are available

async function loadSavedCredentialsIfExists() {

    try {
        const content = fs.readFileSync(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (error) {
        return null;
    }
}

// Save the credentials to a file

async function saveCredentials(client) {
    const content = fs.readFileSync(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.web || keys.installed;
    const payload = JSON.stringify({
        type: 'authorized_user',
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    fs.writeFileSync(TOKEN_PATH, payload);
}

async function authorize() {
    let client = await loadSavedCredentialsIfExists();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,

    });
    if (client.credentials) {
        await saveCredentials(client);
    }
}

authorize().then((auth) => {
    console.log('Token Generated');
}).catch((error) => {
    console.error(error);
});

module.exports = { authorize };