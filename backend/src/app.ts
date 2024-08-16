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

const ORIGIN =  'http://localhost:4200' || 'https://gis-aram.github.io/shared-calendar';

const corsOptions = {
    origin: ORIGIN, // de URL van je frontend die je wilt toestaan
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // geef de HTTP-methoden op die je wilt toestaan
    allowedHeaders: ['Content-Type', 'Authorization'], // geef de headers op die je wilt toestaan
    credentials: true // stel dit in als je cookies of andere referenties wilt toestaan
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/invitations', invitationRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});