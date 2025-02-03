import { google } from "googleapis";
import { oauth2Client } from "../index.js";

const getEmails = async (req, res) => {
    try {
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const response = await gmail.users.messages.list({
            userId: "me",
            maxResults: 10,
        });

        const emails = await Promise.all(
            response.data.messages.map(async (message) => {
                const email = await gmail.users.messages.get({
                    userId: "me",
                    id: message.id,
                });
                return email.data;
            })
        );

        res.json(emails);
    } catch (error) {
        console.error("Error fetching emails:", error);
        res.status(500).json({ error: "Failed to fetch emails" });
    }
};

const sendEmail = async (req, res) => {
    try {
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const { to, subject, body } = req.body;

        const rawMessage = [
            `To: ${to}`,
            'Content-Type: text/plain; charset="UTF-8"',
            "MIME-Version: 1.0",
            `Subject: ${subject}`,
            "",
            body,
        ].join("\n");

        const encodedMessage = Buffer.from(rawMessage)
            .toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedMessage,
            },
        });

        res.json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
    }
};

const searchEmails = async (req, res) => {
    try {
        const { q = '', maxResults = 10 } = req.query;
        
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        
        const response = await gmail.users.messages.list({
            userId: "me",
            maxResults: parseInt(maxResults),
            q: q
        });

        if (!response.data.messages) {
            return res.json({ messages: [] });
        }

        const emails = await Promise.all(
            response.data.messages.map(async (message) => {
                const email = await gmail.users.messages.get({
                    userId: "me",
                    id: message.id,
                });
                return email.data;
            })
        );

        res.json(emails);
    } catch (error) {
        console.error("Error searching emails:", error);
        res.status(500).json({ 
            error: "Failed to search emails",
            message: error.message 
        });
    }
};
export { getEmails, sendEmail, searchEmails };
