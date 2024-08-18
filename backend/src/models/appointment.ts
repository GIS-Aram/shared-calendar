import mongoose, { Schema, Document, Model } from 'mongoose';
import { IAppointment } from '../types/appointment';

// Interface representing a document in MongoDB.
export interface IAppointmentDocument extends IAppointment, Document {}

// Interface that represents the Appointment model
export interface IAppointmentModel extends Model<IAppointmentDocument> {}

const AppointmentSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    // userId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    reminders: [{
        time: Number, // tijd in minuten voor de afspraak
        type: {
            type: String,
            enum: ['email', 'push'], // of andere types die u wilt ondersteunen
            default: 'email'
        }
    }]
});

// Create the model and explicitly specify the document interface and model interface
const AppointmentModel = mongoose.model<IAppointmentDocument, IAppointmentModel>('Appointment', AppointmentSchema);

export default AppointmentModel;