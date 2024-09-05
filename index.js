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

    if (lowerCaseBody === 'approve') {
        twiml.message("Thank you! The employee has successfully checked in.");
        // Additional logic for a successful check-in
    } else if (lowerCaseBody === 'reject') {
        twiml.message("Thank you! The employee check-in has been rejected.");
        // Additional logic for a rejected check-in
    } else {
        // Send the initial check-in request message with buttons
        const responseMessage = `
            Welcome Admin,
            Employee Name: ${employeeName}
            Location: ${location}
            Time: ${time}
            Department: ${department}

            Please approve or reject the employee check-in:
        `;

        const message = twiml.message(responseMessage);
        
        // Adding buttons (interactive message)
        message.media({
            contentType: 'application/json',
            interactive: {
                type: "button",
                body: {
                    text: "Please approve or reject the employee check-in:"
                },
                action: {
                    buttons: [
                        {
                            type: "reply",
                            reply: {
                                id: "approve",
                                title: "Approve"
                            }
                        },
                        {
                            type: "reply",
                            reply: {
                                id: "reject",
                                title: "Reject"
                            }
                        }
                    ]
                }
            }
        });
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
