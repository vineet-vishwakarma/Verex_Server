import { oauth2Client } from "../index.js";

const authLogout = (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out successfully" });
};

const authGmail = (req, res) => {
    console.log('oAuth value',oauth2Client);
    const scopes = [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.modify",
    ];
    console.log("AuthUrl is generating....");
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        prompt: "consent",
    });
    console.log("authurl", authUrl);
    res.redirect(authUrl);
};

const oAuth2Callback = async (req, res) => {
    console.log("Reaching to oAuth2Callback");
    const { code } = req.query;

    try {
        // Exchange authorization code for tokens
        const { tokens } = await oauth2Client.getToken(code);

        // Store tokens in session
        req.session.tokens = tokens;

        // Set credentials for oauth2Client
        oauth2Client.setCredentials(tokens);

        // Redirect to frontend dashboard
        res.redirect("http://localhost:5173/dashboard");
    } catch (error) {
        console.error("Error during OAuth callback:", error);
        res.status(500).json({ error: "Authentication failed" });
    }
};

const authCheck = (req, res) => {
    if (req.session.tokens) {
        console.log(req.session.tokens);
        res.json({ authenticated: true });
    } else {
        res.json({ authenticated: false });
    }
};

export { authCheck, authGmail, authLogout, oAuth2Callback };
