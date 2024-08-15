import mongoose from "mongoose";

export interface IAppointment {
    title: string;
    description: string;
    startTime: Date;
    endTime: Date;
    // userId: string;
    userId: mongoose.Types.ObjectId;
}