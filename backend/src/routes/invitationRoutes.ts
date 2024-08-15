import express from 'express';
import { acceptInvitation } from '../controllers/invitationController';

const router = express.Router();

router.get('/accept/:token', acceptInvitation);

export default router;