import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getEmails,searchEmails,sendEmail } from "../controllers/email.controller.js";
const router=Router();

router.route('/get-emails').get(authMiddleware,getEmails);
router.route('/send-email').post(authMiddleware,sendEmail);
router.route('/search-emails').get(authMiddleware,searchEmails);

export default router;