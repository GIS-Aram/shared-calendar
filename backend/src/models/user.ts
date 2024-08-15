import mongoose, {Schema, Document, Model} from 'mongoose';
import {IUser} from "../types/user";

// Interface representing a document in MongoDB.
export interface IUserDocument extends Document {
    email: string;
    password: string;
    partner: IUser['_id']; //   partner?: mongoose.Schema.Types.ObjectId;
    isTemporary?: boolean;
}

// Interface that represents the Appointment model
export interface IUserModel extends Model<IUserDocument> {}


const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    partner: { type: Schema.Types.ObjectId, ref: 'User' },
    isTemporary: { type: Boolean, default: false }
});

// Create the model and explicitly specify the document interface and model interface
const UserModel = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);

export default UserModel;