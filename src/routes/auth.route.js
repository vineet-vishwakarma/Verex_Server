import { Router } from "express";
import {authGmail,oAuth2Callback,authCheck,authLogout} from "../controllers/auth.controller.js"

const router=Router();

router.route('/gmail').get(authGmail);
router.route('/oauth2callback').get(oAuth2Callback);
router.route('/check').get(authCheck);
router.route('/logout').get(authLogout);

export default router;