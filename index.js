const express = require('express');
const twilio = require('twilio');
const app = express();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));

// Route for the WhatsApp webhook
app.post('/twilio/whatsappwebhook', (req, res) => {
    const { Body, From } = req.body;
    const lowerCaseBody = Body.trim().toLowerCase();
    
    // Set up Twilio response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    // Simulated employee data (replace with dynamic data)
    const employeeName = "John Doe";  
    const location = "New York Office";  
    const time = new Date().toLocaleTimeString();  
    const department = "IT Department";

    // Initial message logic (if admin hasn't replied with Approve/Reject yet)
    if (lowerCaseBody === '1' || lowerCaseBody.includes('approve')) {
        twiml.message("Thank you! The employee has successfully checked in.");
        // You can add any additional logic for a successful check-in here
    } else if (lowerCaseBody === '2' || lowerCaseBody.includes('reject')) {
        twiml.message("Thank you! The employee check-in has been rejected.");
        // You can add any additional logic for a rejected check-in here
    } else {
        // Send the initial check-in request message
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
        twiml.message(responseMessage);
    }

    // Respond to Twilio
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

// Simple route for testing
app.get('/', (req, res) => {
    res.send("Hello");
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Webhook server running on http://localhost:${port}`);
});
