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

const getEmailById = async (req, res) => {
    try {
        const { messageId } = req.params;

        if (!messageId) {
            return res.status(400).json({ error: "Message ID is required" });
        }

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });

        const email = await gmail.users.messages.get({
            userId: "me",
            id: messageId,
            format: "full",
        });

        // Parse email headers
        const headers = {};
        email.data.payload.headers.forEach((header) => {
            headers[header.name.toLowerCase()] = header.value;
        });

        // Parse email body
        let body = "";
        if (email.data.payload.parts) {
            // Handle multipart messages
            const parts = email.data.payload.parts;
            body = parts
                .filter((part) => part.mimeType === "text/plain")
                .map((part) => {
                    const bodyData = part.body.data;
                    return bodyData
                        ? Buffer.from(bodyData, "base64").toString("utf-8")
                        : "";
                })
                .join("\n");
        } else if (email.data.payload.body.data) {
            // Handle single part messages
            body = Buffer.from(email.data.payload.body.data, "base64").toString(
                "utf-8"
            );
        }

        const formattedEmail = {
            id: email.data.id,
            threadId: email.data.threadId,
            labelIds: email.data.labelIds,
            snippet: email.data.snippet,
            subject: headers.subject,
            from: headers.from,
            to: headers.to,
            date: headers.date,
            body: body,
        };

        res.json(formattedEmail);
    } catch (error) {
        console.error("Error fetching email:", error);
        res.status(500).json({
            error: "Failed to fetch email",
            details: error.message,
        });
    }
};

export { getEmails, sendEmail, searchEmails, getEmailById };
