const express = require('express');
const twilio = require('twilio');
const app = express();
const cors = require('cors');
const connectTOMongo = require('./db.js');
const Employee = require('./Models/Emp.js');
const OffsiteAttendance = require('./Models/offsiteAttendance.js');

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse JSON bodies
app.use(cors());
connectTOMongo();

// Route for the WhatsApp webhook (changed to POST)
app.post('/twilio/whatsappwebhook', (req, res) => {
    const { Body, From } = req.body;
    const lowerCaseBody = Body.trim().toLowerCase();   
    
    // Set up Twilio response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    // Simulated employee data (replace with dynamic data)
    const employeeName = "Employee1";
    const location = "GAIL India-Navi Mumbai";
    const time = "2:08 AM";
    

    // Handle responses based on the message content
    if (lowerCaseBody === '1' || lowerCaseBody.includes('approve')) {
        twiml.message("Thank you! The employee has successfully checked in.");
        // Additional logic for successful check-in can be added here
    } else if (lowerCaseBody === '2' || lowerCaseBody.includes('reject')) {
        twiml.message("Thank you! The employee check-in has been rejected.");
        // Additional logic for rejected check-in can be added here
    } else if (lowerCaseBody === 'show') {
        // Send the initial check-in request message
        const responseMessage = `
 Dear Admin,

Employee Check-In Request

You have received a check-in request from an employee. Please review the details below:

Employee Name: ${employeeName}
Location: ${location}
Time of Check-In: ${time}

To proceed, kindly respond with one of the following options:

1. Approve - Confirm the employee's check-in.
2. Reject - Decline the employee's check-in.

Thank you for your attention to this matter.

Best regards,
Trackify
`;

        twiml.message(responseMessage);
    } else {
        // If the message is neither approval/rejection nor 'show'
        const defaultMessage = `
Welcome, Admin.

We are pleased to introduce our new manual check-in feature for managing employee attendance from offsite locations.

To receive check-in updates, reply with 'show'. To approve or reject a check-in, respond with '1' for Approve or '2' for Reject.

Thank you for your support and prompt attention.
`;

        twiml.message(defaultMessage);
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
