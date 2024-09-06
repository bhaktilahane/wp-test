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


// Route for the WhatsApp webhook
app.post('/twilio/whatsappwebhook',async (req, res)=> {
    const { Body, From } = req.body;
    const lowerCaseBody = Body.trim().toLowerCase();
    
    // Set up Twilio response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    // Simulated employee data (replace with dynamic data)
    // const latestAttendance = await OffsiteAttendance.findOne()
    //         .sort({ latestCheckin: -1 }) // Sort by latest check-in time (descending)
    //         .populate('emp_id'); // Populate emp_id with Employee details

    //     if (!latestAttendance || !latestAttendance.emp_id) {
    //         return res.status(404).send('No attendance record found.');
    //     }

        // Fetch the employee's name, latest check-in time, and location
        // const employeeName = latestAttendance.emp_id.name;
        // const location = "Somaiya Vidyavihar University"; // Set location (replace if it's stored in DB)
        // const time = latestAttendance.latestCheckin ? latestAttendance.latestCheckin.toLocaleTimeString() : 'Not checked in yet';


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

           Employee Name: TOyash
           Location: office
           Time of Check-In: 2:00
           Department:comps

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


