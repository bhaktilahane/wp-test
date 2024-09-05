const express = require('express');
const twilio = require('twilio');
const app = express();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));

// Route for the WhatsApp webhook
app.post('/twilio/whatsappwebhook', (req, res) => {
    const { Body, From } = req.body;
    
    // Simulated employee data (replace with dynamic data)
    const employeeName = "John Doe";  
    const location = "New York Office";  
    const time = new Date().toLocaleTimeString();  
    const department = "IT Department";
    
    // Custom message with simulated buttons
    const responseMessage = `
        Welcome Admin,
        Employee Name: ${employeeName}
        Location: ${location}
        Time: ${time}
        Department: ${department}

        Please reply with:
        1️⃣ Approve
        2️⃣ Reject
    `;
    
    // Set up Twilio response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();
    twiml.message(responseMessage);
    
    // Send the response back to Twilio
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

// Step 2: Handle the Admin's Reply (Simulated Buttons)
app.post('/twilio/whatsappwebhook', (req, res) => {
    const { Body, From } = req.body;
    const lowerCaseBody = Body.trim().toLowerCase();
    
    // Set up Twilio response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    // Handle the admin's reply
    if (lowerCaseBody === '1' || lowerCaseBody.includes('approve')) {
        twiml.message("Thank you! The employee has successfully checked in.");
        // You can add any additional logic for a successful check-in here
    } else if (lowerCaseBody === '2' || lowerCaseBody.includes('reject')) {
        twiml.message("Thank you! The employee check-in has been rejected.");
        // You can add any additional logic for a rejected check-in here
    } else {
        twiml.message("Invalid response. Please reply with '1' to Approve or '2' to Reject.");
    }
    
    // Respond to Twilio
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Webhook server running on http://localhost:${port}`);
});
