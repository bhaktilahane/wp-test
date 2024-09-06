const express = require('express');
const twilio = require('twilio');
const app = express();
const cors=require('cors')
const connectTOMongo = require('./db.js')

const OffsiteAttendance = require('./Models/offsiteAttendance.js');


// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(cors());
connectTOMongo();


app.get('/twilio/whatsappwebhook', async (req, res) => {
    try {
        // Fetch all OffsiteAttendance records from the database
        const allAttendance = await OffsiteAttendance.find(); // Populating emp_id with employee details

        // Respond with the attendance data
        res.status(200).json(allAttendance);
    } catch (error) {
        console.error('Error fetching offsite attendance:', error);
        res.status(500).json({ error: 'An error occurred while fetching offsite attendance.' });
    }
});


// Route for the WhatsApp webhook
app.post('/twilio/whatsappwebhook', (req, res) => {
    const { Body, From } = req.body;
    const lowerCaseBody = Body.trim().toLowerCase();
    
    // Set up Twilio response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    // Simulated employee data (replace with dynamic data)
    const employeeName = "Employee1";
    const location = "Somaiya Vidyavihar University";
    const time = new Date().toLocaleTimeString();
    const department = "Computer Department";

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

You have received a check-in request from an employee. Please find the details below:

           Employee Name: ${employeeName}
           Location: ${location}
           Time of Check-In: ${time}
           Department: ${department}

            To proceed, kindly respond with one of the following options:
            1️⃣ Approve - Confirm the employee's check-in.
            2️⃣ Reject - Decline the employee's check-in.

            Thank you for your attention to this matter.

            Best regards,
            Trackify
        `;
        twiml.message(responseMessage);
    } else {
        // If the message is neither approval/rejection nor 'show'
        twiml.message("To receive employee check-in updates, please reply with 'show'. For approving or rejecting check-ins, use '1' for Approve or '2' for Reject.");
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


