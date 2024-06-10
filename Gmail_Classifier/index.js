const express = require('express');
const cors = require('cors');


const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(cors());
const port = 3000;

app.post('/receive', (req, res) => {
    const { emails } = req.body;
    emails.forEach((email) => {
        console.log('Email body', email.headers);
    });
    res.json({ success: true });
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
