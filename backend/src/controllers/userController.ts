import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {IUser} from "../types/user";
import {sendEmail} from "../services/emailService";
import crypto from 'crypto';
import IInvitation from '../models/invitation';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Password validation
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'Wachtwoord voldoet niet aan de eisen' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }) as IUser | null
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.status(200).json({ result: user, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const invitePartner_Old = async (req: Request, res: Response) => {
    try {
        const { partnerEmail } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // In een echte applicatie zou je hier een uitnodiging sturen
        res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

export const invitePartner_Werkend = async (req: Request, res: Response) => {
    try {
        const { partnerEmail } = req.body;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hier zou je normaal gesproken een uitnodiging opslaan in de database
        // en een unieke uitnodigingslink genereren

        // Stuur een e-mail naar de partner
        await sendEmail(
            'gmail',
            partnerEmail,
            'Uitnodiging voor Shared Calendar',
            `Je bent uitgenodigd om deel te nemen aan een gedeelde kalender. Klik hier om de uitnodiging te accepteren: [LINK]`
        );

        res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error: any) {
        console.error('Error inviting partner:', error);
        res.status(500).json({ message: 'Error inviting partner', error: error.message });
    }
};

export const invitePartner = async (req: Request, res: Response) => {
    try {
        const { partnerEmail } = req.body;
        const user = await User.findById(req.userId) as IUser | null;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Genereer een unieke token
        const token = crypto.randomBytes(20).toString('hex');

        // Sla de uitnodiging op in de database
        const invitation = new IInvitation({
            inviter: user._id,
            inviteeEmail: partnerEmail,
            token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Verloopt na 7 dagen
        });
        await invitation.save();

        // Genereer de uitnodigingslink
        const invitationLink = `${process.env.FRONTEND_URL}/accept-invitation/${token}`;

        // Stuur een e-mail naar de partner
        await sendEmail(
            'gmail',
            partnerEmail,
            'Uitnodiging voor Shared Calendar',
            `Je bent uitgenodigd om deel te nemen aan een gedeelde kalender. Klik hier om de uitnodiging te accepteren: ${invitationLink}`
        );

        res.status(200).json({ message: 'Invitation sent successfully' });
    } catch (error: any) {
        console.error('Error inviting partner:', error);
        res.status(500).json({ message: 'Error inviting partner', error: error.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password'); // Exclude the password field

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error: any) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error: (error as Error).message });
    }
};