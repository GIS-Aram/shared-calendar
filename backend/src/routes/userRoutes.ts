import express from 'express';
import { register, login, invitePartner } from '../controllers/userController';
import auth from "../middleware/auth";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/invite-partner', auth, invitePartner);

export default router;