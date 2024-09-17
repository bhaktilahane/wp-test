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
        // Send the initial check-in request message with improved formatting
        const responseMessage = `
Dear Admin,

Employee Check-In Request

You have received a check-in request from an employee. Please review the details below:

Employee Name: ${employeeName}
Location: ${location}
Time of Check-In: ${time}
Department: ${department}

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
        twiml.message("To receive employee check-in updates, please reply with 'show'. For approving or rejecting check-ins, use '1' for Approve or '2' for Reject.");
    }

    // Respond to Twilio
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});
