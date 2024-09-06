const express = require('express');
const twilio = require('twilio');
const app = express();



// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));


// Simple route for testing
app.get('/', (req, res) => {
    res.send("Hello");
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Webhook server running on http://localhost:${port}`);
});
