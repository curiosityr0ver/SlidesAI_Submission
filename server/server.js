const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; // Use environment variable for port or default to 5000


app.use(express.json());
app.use(cors());

// Replace with your Gemini API key and endpoint URL (obtain from Gemini)
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function classifyEmails(emails) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = "Classify this email into SPAM/PROMOTIONS/PERSONAL/TRAVEL/FINANCE/UPDATES/UNCATEGORIZED or any other relevent field. Simply return the classification in all caps. A single email may have more than one classification.";


    const classifiedEmails = await Promise.all(emails.map(async (email) => {
        const { from, subject, body } = email;
        const result = await model.generateContent([prompt, from, subject, body]);

        return result.response.text().replace(/(\r\n|\n|\r)/gm, "");
    }));

    return classifiedEmails;


}

app.post('/classify', async (req, res) => {
    console.log("Pinged");
    const { emails } = req.body;
    const classifiedEmails = await classifyEmails(emails);
    res.json(classifiedEmails);
    // res.;
});

app.get('/', (req, res) => {
    console.log("Pinged");
    res.json({ data: "Hello from server" });
});





app.listen(port, () => {
    console.clear();
    console.log(`Server listening on port ${port}`);
});
