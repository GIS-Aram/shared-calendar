import express from 'express';
import {register, login, invitePartner, getUserById} from '../controllers/userController';
import auth from "../middleware/auth";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/invite-partner', auth, invitePartner);
router.get('/:id', auth, getUserById);

export default router;