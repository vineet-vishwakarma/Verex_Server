import { config } from "../config.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { oauth2Client } from "../index.js";
import { google } from "googleapis";

const toolSendEmail = async ({to,subject,body}) => {
    try {
        const gmail = google.gmail({ version: "v1", auth: oauth2Client });

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

        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};

function summarizeEmail(email) {
    console.log("eamil summarize successfully");
}

const tools = {
    sendEmail: toolSendEmail,
    summarizeEmail: summarizeEmail,
};

const SYSTEM_PROMPT = `You are an AI Assistant with START, PLAN, ACTION, Observation and Output State.
Wait for the user prompt and first PLAN using available tools.
After Planning, Take the action with appropriate tools and wait for Observation based on Action.
Once you get the observations, Return the AI response based on START promt and observations.

Availabe Function:
- sendEmail
  this function is used to send email and it requires "to":"email address", "subject": "subject of email", "body": "body of email"

- summarizeEmail:
  this function is used to summarize the selected email.

The signature of email will be "Verex Ai Agent"

Example:
START
{"type": "user","user": "Send email to @vincarnage420@gmail.com about good old school days."}
{"type": "plan","plan": "I will call sendEmail function with email address @vincarnage420@gmail.com and subject= about good old school days."}
{"type": "action","function": "sendEmail","input":{"to":"@vincarnage420@gmail.com","subject":"About good old school days.","body":"I hope this email finds you well! Lately, I've been reminiscing about our school days, and I couldn't help but smile at all the wonderful memories we created together.

Do you remember those carefree afternoons spent hanging out after class, the laughter we shared during lunch breaks, and the countless inside jokes that only we understood? It’s hard to believe how quickly time has flown since those days. The excitement of school events, the thrill of sports competitions, and the late-night study sessions (or should I say, procrastination sessions?) are moments I cherish deeply.

I often think about our teachers and how they shaped our lives, and I’m grateful for the friendships we built during those formative years. It’s amazing how those experiences have influenced who we are today.

Let’s catch up soon! I’d love to hear your favorite memories from school and see how life has been treating you.

Take care and talk soon!"}}

{"type": "observation","observation": "Email sent to vincarnage420@gmail.com successfully"}
{"type":"output","output":"Email sent succesfully"}
`;

const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" },
});

const AiAgent = async (req, res) => {
    const messages = [
        {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }],
        },
    ];
    const input = req.body.command;
    console.log(input);
    messages.push({ role: "user", parts: [{ text: input }] });
    const prompt = {
        contents: messages,
    };

    try {
        while (true) {
            const chat = await model.generateContent(prompt);
            const result = chat.response.text();
            messages.push({ role: "assistant", parts: [{ text: result }] });
            console.log(`\n------------------AI Start----------------------\n`);
            console.log("🤖", result);
            console.log(`\n------------------AI End------------------------\n`);
            const action = JSON.parse(result);
            if (action.type === "output") {
                console.log(
                    `🤖: ${action.type}, ${action.output || action.state}`
                );
                res.status(200).json({ message: "Email sent successfully" });
                return;
            } else if (action.type === "action") {
                const fn = tools[action.function];
                if (!fn) {
                    throw new Error("Invalid Tool Call");
                }
                const observation = await fn(action.input);
                console.log("Observation", observation);
                const observationMessage = {
                    type: "observation",
                    observation: observation,
                };
                messages.push({
                    role: "model",
                    parts: [{ text: JSON.stringify(observationMessage) }],
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export { AiAgent };