import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { deleteEmail, getEmailById, getEmails,searchEmails,sendEmail } from "../controllers/email.controller.js";
const router=Router();

router.route('/get-emails').get(authMiddleware,getEmails);
router.route('/send-email').post(authMiddleware,sendEmail);
router.route('/search-emails').get(authMiddleware,searchEmails);
router.route('/email/get-email/:messageId').get(authMiddleware,getEmailById);
router.delete('/email/delete-email/:messageId',authMiddleware,deleteEmail);

export default router;