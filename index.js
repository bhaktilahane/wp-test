const express = require('express');
const twilio = require('twilio');
const app = express();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));

// Route for the WhatsApp webhook
app.post('/twilio/whatsappwebhook', (req, res) => {
    const { Body, From } = req.body;
    
    // Logging the received message for debugging
    console.log(`Received message from ${From}: ${Body}`);
    
    // Simulated employee data (can be replaced with dynamic data)
    const employeeName = "John Doe";  // Replace with actual data
    const location = "New York Office";  // Replace with actual data
    const time = new Date().toLocaleTimeString();  // Current time
    const department = "IT Department";  // Replace with actual data
    
    // Customizing the message
    const responseMessage = `
        Welcome Admin,
        Employee Name: ${employeeName}
        Location: ${location}
        Time: ${time}
        Department: ${department}

        Please reply with "Approve" or "Reject" to approve or reject the check-in.
    `;
    
    // Set up Twilio response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();
    twiml.message(responseMessage);
    
    // Responding to Twilio with the message
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
    console.log(`Webhook server running on http://localhost:${port}`);
});
