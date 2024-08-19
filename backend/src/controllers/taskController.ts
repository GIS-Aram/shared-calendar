import { Request, Response } from 'express';
import Task from '../models/task';
import User from "../models/user";

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, dueDate, appointmentId, actions } = req.body;
        const task = new Task({
            title,
            description,
            dueDate,
            appointmentId,
            actions,
            userId: req.userId,
            createdBy: req.userId
        });
        await task.save();
        res.status(201).json(task);
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

export const getTasks_Works = async (req: Request, res: Response) => {
    try {
        const tasks = await Task.find({ userId: req.userId });
        res.status(200).json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let taskIds = [req.userId];
        if (user.partner) {
            taskIds.push(user.partner as string);
        }

        // const tasks = await Task.find({ userId: { $in: taskIds } });
        const tasks = await Task.find({ userId: { $in: taskIds } })
            .populate('createdBy', 'email')
            .populate('updatedBy', 'email');
        res.status(200).json(tasks);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

export const updateTaskOnePerson = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        // const update = req.body;
        const update = { ...req.body, updatedBy: req.userId, updatedAt: new Date() };

        const task = await Task.findOneAndUpdate({ _id: id, userId: req.userId }, update, { new: true });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

export const deleteTaskOnePerson = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const update = { ...req.body, updatedBy: req.userId, updatedAt: new Date(), actions: req.body.actions};
        const task = await Task.findOneAndUpdate(
            { _id: id,
                // $or: [{ userId: req.userId }, { userId: user.partner }]
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
        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to update it' });
        }
        res.status(200).json(task);
    } catch (error: any) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const task = await Task.findOneAndDelete({
            _id: id,
            // $or: [{ userId: req.userId }, { userId: user.partner }]
            $or: [
                { userId: req.userId },
                { sharedWith: req.userId },
                { userId: user.partner },
                { sharedWith: user.partner }
            ]
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found or you do not have permission to delete it' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};