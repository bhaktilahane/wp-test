const express = require('express');
const twilio = require('twilio');
const app = express();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));

// Route for the WhatsApp webhook
app.post('/twilio/whatsappwebhook', (req, res) => {
    const { Body, From } = req.body;
    
    // Correct string interpolation and wrapping
    console.log(`Received message from ${From}: ${Body}`);
    
    // Customize your message here
    const responseMessage = `You said: "${Body}"`;
    
    // Set up Twilio response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();
    twiml.message(responseMessage);
    
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

// Simple route for testing
app.get('/', (req, res) => {
    res.send("Hello");
});

// Start server on port 3000
const port = 3000;
app.listen(port, () => {
    // Correct string interpolation for port message
    console.log(`Webhook server running on http://localhost:${port}`);
});
