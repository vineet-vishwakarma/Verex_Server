import { oauth2Client } from "../index.js";

const authMiddleware = (req, res, next) => {
    if (!req.session.tokens) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    oauth2Client.setCredentials(req.session.tokens);
    next();
  };

export {authMiddleware};