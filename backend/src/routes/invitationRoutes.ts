import express from 'express';
import { acceptInvitation } from '../controllers/invitationController';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const invitationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuten
    max: 5 // limiet elke IP tot 5 verzoeken per venster
});

router.get('/accept/:token', invitationLimiter, acceptInvitation);

export default router;