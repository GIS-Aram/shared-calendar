import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import appointmentRoutes from './routes/appointmentRoutes';
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import invitationRoutes from "./routes/invitationRoutes";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/invitations', invitationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});