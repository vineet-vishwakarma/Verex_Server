import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { deleteEmail, getEmailById, getEmails,getImportantEmails,getSentEmails,getSpamEmails,getUnreadEmails,searchEmails,sendEmail } from "../controllers/email.controller.js";
const router=Router();

router.route('/get-emails').get(authMiddleware,getEmails);
router.route('/send').get(authMiddleware,getSentEmails);
router.route('/spam').get(authMiddleware,getSpamEmails);
router.route('/unread').get(authMiddleware,getUnreadEmails);
router.route('/important').get(authMiddleware,getImportantEmails);

router.route('/send-email').post(authMiddleware,sendEmail);
router.route('/search-emails').get(authMiddleware,searchEmails);
router.route('/get-email/:messageId').get(authMiddleware,getEmailById);
router.route('/delete-email/:messageId').delete(authMiddleware,deleteEmail);


export default router;