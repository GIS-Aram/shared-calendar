import mongoose from 'mongoose';

// Interface representing the Task data
export interface ITask {
    title: string;
    description?: string;
    dueDate?: Date;
    completed: boolean;
    appointmentId?: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
}
