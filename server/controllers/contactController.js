import nodemailer from 'nodemailer';

// Create a transporter or use a dummy one if credentials aren't present
// NOTE: For real email sending, USER MUST Provide valid credentials in .env
// SUPPORT_EMAIL and SUPPORT_PASSWORD (app specific password)

const sendFeedback = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        console.log(`Received feedback from ${name} (${email}): ${message}`);

        // Check if environment variables are set
        const supportEmail = process.env.SUPPORT_EMAIL;
        const supportPassword = process.env.SUPPORT_PASSWORD;

        if (!supportEmail || !supportPassword) {
            console.log("WARNING: SUPPORT_EMAIL or SUPPORT_PASSWORD not set in .env. Email will NOT be sent.");
            // We still return success to frontend to simulate the experience
            return res.json({ success: true, message: "Feedback received (Simulated)" });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: supportEmail,
                pass: supportPassword
            }
        });

        const mailOptions = {
            from: supportEmail, // Sent from our support email
            to: 'kanishjaikumar06@gmail.com', // Sent TO the specific address requested
            subject: `New Feedback from ${name}`,
            text: `You have received a new feedback message from your website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            replyTo: email, // Allow replying directly to the user
            html: `
                <h3>New Feedback Received</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <div style="border: 1px solid #ddd; padding: 10px; margin-top: 10px;">
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
        res.json({ success: true, message: "Feedback sent successfully" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.json({ success: false, message: "Error sending email: " + error.message });
    }
}

export { sendFeedback };
