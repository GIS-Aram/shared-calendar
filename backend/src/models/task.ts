// models/task.ts
import mongoose from 'mongoose';

const actionSchema = new mongoose.Schema({
    description: { type: String, required: true },
    completed: { type: Boolean, default: false }
});

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    actions: [actionSchema]
});

export default mongoose.model('Task', taskSchema);