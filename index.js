const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const connectTOMongo = require('./db.js');
const Employee = require('./Models/Emp.js');
const OffsiteAttendance = require('./Models/offsiteAttendance.js');

const app = express();

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse JSON bodies
app.use(cors());

// Connect to MongoDB
connectTOMongo();

// Route for the WhatsApp webhook
app.post('/twilio/whatsappwebhook', async (req, res) => {
    const { Body, From } = req.body;
    const lowerCaseBody = Body.trim().toLowerCase();   
    
    // Set up Twilio response
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    // Retrieve employee data from MongoDB based on the phone number (From)
    try {
        const employee = await Employee.findOne({ phone: From });

        if (!employee) {
            twiml.message("Sorry, we could not find your record. Please contact the admin.");
            return res.writeHead(200, { 'Content-Type': 'text/xml' }).end(twiml.toString());
        }

        const employeeName = employee.name;
        const location = employee.location; // Assuming employee data contains location
        const time = new Date().toLocaleTimeString();
        const department = employee.department;

        // Handle responses based on the message content
        if (lowerCaseBody === '1' || lowerCaseBody.includes('approve')) {
            await OffsiteAttendance.create({
                employeeName,
                location,
                time,
                department,
                status: 'approved'
            });
            twiml.message("Thank you! Your check-in has been approved.");
        } else if (lowerCaseBody === '2' || lowerCaseBody.includes('reject')) {
            await OffsiteAttendance.create({
                employeeName,
                location,
                time,
                department,
                status: 'rejected'
            });
            twiml.message("Thank you! Your check-in has been rejected.");
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
    } catch (error) {
        console.error("Error handling webhook request:", error);
        twiml.message("There was an error processing your request. Please try again later.");
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
