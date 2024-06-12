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
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
const prompt = "Classify this email into SPAM/PROMOTIONS/PERSONAL/TRAVEL/FINANCE/UPDATES/SECURITY/UNCATEGORIZED or any other relevent field. Simply return the classification in all caps. A single email may have more than one classification.";
const randomMotivationalPrompt = "Write a motivational quote to inspire someone to take action.";
const describeModelPrompt = "Tell me about yourself. Give details like model, version, parameters, and other relevant information.";

async function classifyEmails(emails) {
    const classifiedEmails = await Promise.all(emails.map(async (email) => {
        const { from, subject, body } = email;
        const result = await model.generateContent([prompt, from, subject, body]);

        return result.response.text().replace(/(\r\n|\n|\r)/gm, "");
    }));

    return classifiedEmails;


}

app.post('/classify', async (req, res) => {
    try {
        const { emails } = req.body;
        const classifiedEmails = await classifyEmails(emails);
        res.json(classifiedEmails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', async (req, res) => {
    try {
        const generatedQuote = await model.generateContent([randomMotivationalPrompt]);
        const response = generatedQuote.response.text().split("\n")[0].split('"')[1];
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});



app.listen(port, () => {
    console.clear();
    console.log(`Server listening on port ${port}`);
});
