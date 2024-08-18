import { Request, Response } from 'express';
import Invitation, {IInvitation} from '../models/invitation';
import User from '../models/user';
import {IUser} from "../types/user";
import bcrypt from 'bcryptjs';

export const acceptInvitation = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const invitation = await Invitation.findOne({ token, isAccepted: false, expiresAt: { $gt: new Date() } }) as IInvitation | null;

        if (!invitation) {
            return res.status(400).json({ message: 'Invalid or expired invitation' });
        }

        // Update the invitation
        // invitation.isAccepted = true;
        // await invitation.save();
        await Invitation.updateOne({ _id: invitation._id }, { isAccepted: true });

        // Update the users
        // const inviter = await User.findById(invitation.inviter) as IUser | null;
        // const invitee = await User.findOne({ email: invitation.inviteeEmail }) as IUser | null;
        //
        // if (!inviter || !invitee) {
        //     return res.status(404).json({ message: 'User not found' });
        // }
        //
        // inviter.partner = invitee._id;
        // invitee.partner = inviter._id;
        await User.updateOne({ _id: invitation.inviter }, { partner: invitation.inviteeEmail });
        await User.updateOne({ email: invitation.inviteeEmail }, { partner: invitation.inviter });

        // await inviter.save();
        // await invitee.save();

        res.status(200).json({ message: 'Invitation accepted successfully' });
    } catch (error: any) {
        console.error('Error accepting invitation:', error);
        res.status(500).json({ message: 'Error accepting invitation', error: error.message });
    }
};

export const acceptInvitation__Werkend = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const invitation = await Invitation.findOne({ token, isAccepted: false, expiresAt: { $gt: new Date() } }) as IInvitation | null;

        if (!invitation) {
            return res.status(400).json({ message: 'Invalid or expired invitation' });
        }

        // Check if invitee already has an account
        let invitee = await User.findOne({ email: invitation.inviteeEmail }) as IUser | null;

        if (!invitee) {
            // Create a temporary account for the invitee
            const tempPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(tempPassword, 12);

            invitee = new User({
                email: invitation.inviteeEmail,
                password: hashedPassword,
                isTemporary: true
            }) as IUser;

            // Letop:::::
            await User.updateOne(
                { email: invitation.inviteeEmail, password: hashedPassword, isTemporary: true},
                { partner: invitation.inviter },
                );

            // await invitee.save();
        }

        // Update the invitation
        await Invitation.updateOne({ _id: invitation._id }, { isAccepted: true });

        // Update the users
        await User.updateOne({ _id: invitation.inviter }, { partner: invitee._id });
        await User.updateOne({ _id: invitee._id }, { partner: invitation.inviter });

        if (invitee.isTemporary) {
            res.status(200).json({
                message: 'Invitation accepted successfully. Please complete your registration.',
                needsRegistration: true,
                email: invitee.email
            });
        } else {
            res.status(200).json({ message: 'Invitation accepted successfully' });
        }
    } catch (error: any) {
        console.error('Error accepting invitation:', error);
        res.status(500).json({ message: 'Error accepting invitation', error: error.message });
    }
};