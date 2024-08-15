import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface representing a document in MongoDB.
export interface IInvitation  extends Document {
    inviter: string;
    inviteeEmail: string;
    token: string;
    expiresAt: Date;
    isAccepted: boolean;
}

// Interface that represents the Appointment model
export interface IInvitationModel extends Model<IInvitation > {}

const InvitationSchema: Schema = new Schema({
    inviter: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    inviteeEmail: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    isAccepted: { type: Boolean, default: false }
});

// Create the model and explicitly specify the document interface and model interface
const InvitationModel = mongoose.model<IInvitation, IInvitationModel>('Invitation', InvitationSchema);

export default InvitationModel;