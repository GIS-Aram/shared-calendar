import mongoose from "mongoose";

export interface IUser {
    // MongoDB ID kan ObjectId of string zijn
    _id?: mongoose.Types.ObjectId | string; // MongoDB ID is optioneel omdat het niet aanwezig is bij het aanmaken van een nieuwe gebruiker
    email: string;
    password: string;
    partner?: string;
    isTemporary?: boolean;
}