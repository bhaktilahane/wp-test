const express = require('express');
const twilio = require('twilio');
const app = express();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));

// Route for the WhatsApp webhook
app.post('/twilio/whatsappwebhook', (req, res) => {
    const { Body, From } = req.body;
    
    console.log(`Received message from ${From}: ${Body}`);
    
    // Customize the message
    const employeeName = "John Doe";  // Sample data - Replace with actual dynamic data
    const location = "New York Office"; // Sample data - Replace with actual dynamic data
    const time = new Date().toLocaleTimeString();
    const department = "IT Department";  // Sample data - Replace with actual dynamic data
    
    // Customized message content
    const responseMessage = `
        Welcome Admin,
        Employee Name: ${employeeName}
        Location: ${location}
        Time: ${time}
        Department: ${department}

        Please approve or reject the check-in.
    `;
    
    // Set up Twilio response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    // Adding text content
    const message = twiml.message(responseMessage);

    // Add buttons for Approve and Reject (interactive templates)
    message.body("Approve").action("https://your-approve-url.com").method('POST');
    message.body("Reject").action("https://your-reject-url.com").method('POST');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

// Simple route for testing
app.get('/', (req, res) => {
    res.send("Hello");
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Webhook server running on http://localhost:${port}`);
});
