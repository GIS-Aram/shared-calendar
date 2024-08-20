// src/routes/appointmentRoutes.ts

import express from 'express';
import {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment, createAppointments
} from '../controllers/appointmentController';
import auth from '../middleware/auth';

const router = express.Router();

// POST /api/appointments
router.post('/', auth, createAppointment);

router.get('/', auth, getAppointments);

// GET /api/appointments/:userId
router.get('/user/:userId', auth, getAppointments);

// GET /api/appointments/:id
router.get('/:id', auth, getAppointmentById);

// PUT /api/appointments/:id
router.put('/:id', auth, updateAppointment);

// DELETE /api/appointments/:id
router.delete('/:id', auth, deleteAppointment);

router.post('/bulk', auth, createAppointments);

export default router;