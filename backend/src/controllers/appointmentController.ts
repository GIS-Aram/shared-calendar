// src/controllers/appointmentController.ts

import { Request, Response } from 'express';
import AppointmentModel from '../models/appointment';
import Appointment from "../models/appointment";
import {sendEmail} from "../services/emailService";
import {sendPushNotification} from "../services/pushNotificationService";
import User from "../models/user";
import {IUser} from "../types/user";
import mongoose from "mongoose";

// Helper typecasting function to access userId
const getUserId = (req: Request): string | undefined => req.userId;

// export const createAppointment = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const newAppointment = new AppointmentModel(req.body);
//         const savedAppointment = await newAppointment.save();
//         res.status(201).json(savedAppointment);
//     } catch (error) {
//         res.status(400).json({ message: 'Error creating appointment', error });
//     }
// };
export const createAppointment_Old = async (req: Request, res: Response) => {
    try {
        // Controleer voor bestaande afspraken
        const existingAppointment = await Appointment.findOne({ date: req.body.date, creator: getUserId(req) });
        if (existingAppointment) {
            return res.status(409).json({ message: 'Appointment already exists on this date' });
        }

        // Voeg logging toe om te controleren of userId correct wordt doorgegeven
        console.log("Creating appointment for userId:", getUserId(req));

        // const newAppointment = new Appointment({ ...req.body, creator: req.userId });
        const newAppointment = new Appointment({ ...req.body, creator: getUserId(req) });
        await newAppointment.save();


        // Stuur een e-mail notificatie
        await sendEmail('gmail', req.body.email, 'Nieuwe afspraak', 'Er is een nieuwe afspraak gemaakt.');

        // Stuur een push notificatie
        await sendPushNotification(getUserId(req)!, 'Nieuwe afspraak', 'Er is een nieuwe afspraak gemaakt.');


        res.status(201).json(newAppointment);
    } catch (error: any) {
        console.error('Error creating appointment:', error);
        res.status(409).json({ message: error.message });
    }
};

export const createAppointment_Werkend = async (req: Request, res: Response) => {
    try {
        // Controleer voor bestaande afspraken
        const existingAppointment = await Appointment.findOne({ date: req.body.date, userId: req.userId });
        if (existingAppointment) {
            return res.status(409).json({ message: 'Appointment already exists on this date' });
        }

        // Voeg logging toe om te controleren of userId correct wordt doorgegeven
        console.log("Creating appointment for userId:", req.userId);

        // Zorg ervoor dat userId correct wordt ingesteld
        const newAppointment = new Appointment({ ...req.body, userId: req.userId });
        await newAppointment.save();

        // Stuur een e-mail notificatie
        await sendEmail('gmail', req.body.email, 'Nieuwe afspraak', 'Er is een nieuwe afspraak gemaakt.');

        // Stuur een push notificatie
        await sendPushNotification(req.userId!, 'Nieuwe afspraak', 'Er is een nieuwe afspraak gemaakt.');

        res.status(201).json(newAppointment);
    } catch (error: any) {
        console.error('Error creating appointment:', error);
        res.status(409).json({ message: error.message });
    }
};
export const createAppointment = async (req: Request, res: Response) => {
    try {
        const { startTime, endTime, title, description, reminders, taskIds  } = req.body;
        console.log('Creating appointment with data:', req.body); // Debugging

        // Controleer voor overlappende afspraken
        const overlappingAppointment = await Appointment.findOne({
            userId: req.userId,
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                { startTime: { $gte: startTime, $lt: endTime } },
                { endTime: { $gt: startTime, $lte: endTime } }
            ]
        });

        if (overlappingAppointment) {
            return res.status(409).json({ message: 'An overlapping appointment already exists' });
        }

        console.log("Creating appointment for userId:", req.userId);

        const newAppointment = new Appointment({
            title,
            description,
            startTime,
            endTime,
            reminders,
            taskIds,
            userId: req.userId
        });
        await newAppointment.save();


        // Controleer of de gebruiker een partner heeft
        const user = await User.findById(req.userId) as IUser | null;
        if (user && user.partner) {
            // Haal de partner op om het e-mailadres te krijgen
            const partner = await User.findById(user.partner) as IUser | null;
            if (partner) {
                // Stuur een e-mail notificatie naar de partner
                await sendEmail('gmail', partner.email, 'Nieuwe afspraak', `Er is een nieuwe afspraak gemaakt: ${title}`);

                // Stuur een push notificatie naar de partner (als je een deviceToken hebt opgeslagen)
                // await sendPushNotification(partner._id!.toString(), 'Nieuwe afspraak', `Er is een nieuwe afspraak gemaakt: ${title}`);
            }
        }

        // Schedule reminders
        scheduleReminders(newAppointment);

        // Stuur een e-mail notificatie (optioneel, afhankelijk van je vereisten)
        // await sendEmail('gmail', req.body.email, 'Nieuwe afspraak', 'Er is een nieuwe afspraak gemaakt.');

        // Stuur een push notificatie (optioneel, afhankelijk van je vereisten)
        // await sendPushNotification(req.userId!, 'Nieuwe afspraak', 'Er is een nieuwe afspraak gemaakt.');

        res.status(201).json(newAppointment);
    } catch (error: any) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Error creating appointment', error: error.message });
    }
};

const scheduleReminders = (appointment: any) => {
    appointment.reminders.forEach((reminder: any) => {
        const reminderTime = new Date(appointment.startTime.getTime() - reminder.time * 60000);
        const now = new Date();

        if (reminderTime > now) {
            setTimeout(() => {
                sendReminderEmail(appointment, reminder);
            }, reminderTime.getTime() - now.getTime());
        }
    });
};

const sendReminderEmail = async (appointment: any, reminder: any) => {
    try {
        const user = await User.findById(appointment.userId);
        if (!user || !user.email) {
            throw new Error("User email not found");
        }

        await sendEmail(
            'gmail', // of een andere provider die u gebruikt
            user.email,
            'Herinnering voor afspraak',
            `U heeft een afspraak "${appointment.title}" over ${reminder.time} minuten.`
        );
    } catch (error) {
        console.error('Error sending reminder email:', error);
    }
};

// export const getAppointments = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const userId = req.params.userId;
//         const appointments = await AppointmentModel.find({ userId });
//         res.status(200).json(appointments);
//     } catch (error) {
//         res.status(400).json({ message: 'Error fetching appointments', error });
//     }
// };
export const getAppointments_Werkend = async (req: Request, res: Response) => {
    try {
        const appointments = await Appointment.find({ userId: req.userId });
        res.status(200).json(appointments);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};
export const getAppointments = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId) as IUser | null;
        // const user = await User.findById(req.userId).populate('partner') as IUser | null;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // let userIds: any[] = [user._id];
        // let userIds: mongoose.Types.ObjectId[] = [user._id];
        let userIds: mongoose.Types.ObjectId[] = [new mongoose.Types.ObjectId(user._id)];
        if (user.partner) {
            // userIds.push(user.partner);
            userIds.push(new mongoose.Types.ObjectId(user.partner));
        }

        const appointments = await Appointment.find({ userId: { $in: userIds } });
        res.status(200).json(appointments);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};

export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            res.status(404).json({ message: 'Appointment not found' });
            return;
        }
        res.status(200).json(appointment);
    } catch (error: any) {
        res.status(400).json({ message: 'Error fetching appointment', error });
    }
};

// export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const updatedAppointment = await AppointmentModel.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!updatedAppointment) {
//             res.status(404).json({ message: 'Appointment not found' });
//             return;
//         }
//         res.status(200).json(updatedAppointment);
//     } catch (error) {
//         res.status(400).json({ message: 'Error updating appointment', error });
//     }
// };
export const updateAppointment_old = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedAppointment);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, startTime, endTime, reminders, taskIds } = req.body;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const update = { ...req.body, updatedBy: req.userId, updatedAt: new Date() };
        // const appointment = await Appointment.findOneAndUpdate(
        //     { _id: id, userId: req.userId },
        //     { title, description, startTime, endTime, reminders, taskIds },
        //     { new: true }
        // );
        const appointment = await Appointment.findOneAndUpdate(
            {
                _id: id,
                $or: [
                    { userId: req.userId },
                    { sharedWith: req.userId },
                    { userId: user.partner },
                    { sharedWith: user.partner }
                ]
            },
            update,
            { new: true }
        );
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating appointment', error: error.message });
    }
};

// export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const deletedAppointment = await AppointmentModel.findByIdAndDelete(req.params.id);
//         if (!deletedAppointment) {
//             res.status(404).json({ message: 'Appointment not found' });
//             return;
//         }
//         res.status(200).json({ message: 'Appointment successfully deleted' });
//     } catch (error) {
//         res.status(400).json({ message: 'Error deleting appointment', error });
//     }
// };
export const deleteAppointment = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await Appointment.findByIdAndDelete(id);  // Gebruik findByIdAndDelete in plaats van findByIdAndRemove
        res.json({ message: 'Appointment deleted successfully.' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const createAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = req.body;

        // Voeg userId toe aan elke afspraak
        const appointmentsWithUserId = appointments.map((appointment: any) => ({
            ...appointment,
            userId: req.userId
        }));

        // Check for overlapping appointments
        for (let appointment of appointmentsWithUserId) {
            const overlappingAppointment = await Appointment.findOne({
                userId: req.userId,
                $or: [
                    { startTime: { $lt: appointment.endTime }, endTime: { $gt: appointment.startTime } },
                    { startTime: { $gte: appointment.startTime, $lt: appointment.endTime } },
                    { endTime: { $gt: appointment.startTime, $lte: appointment.endTime } }
                ]
            });

            if (overlappingAppointment) {
                return res.status(409).json({ message: 'An overlapping appointment already exists' });
            }
        }

        const createdAppointments = await Appointment.insertMany(appointmentsWithUserId);

        // Handle partner sharing and notifications
        const user = await User.findById(req.userId) as IUser | null;
        if (user && user.partner) {
            const partner = await User.findById(user.partner) as IUser | null;
            if (partner) {
                // Update appointments to be shared with partner
                await Appointment.updateMany(
                    { _id: { $in: createdAppointments.map(app => app._id) } },
                    { $addToSet: { sharedWith: partner._id } }
                );

                // Send notification to partner
                await sendEmail('gmail', partner.email, 'Nieuwe herhalende afspraken', `Er zijn nieuwe herhalende afspraken gemaakt door ${user.email}`);
            }
        }

        // Schedule reminders for each appointment
        createdAppointments.forEach(appointment => scheduleReminders(appointment));

        res.status(201).json(createdAppointments);
    } catch (error: any) {
        console.error('Error creating appointments:', error);
        res.status(500).json({ message: 'Error creating appointments', error: error.message });
    }
};