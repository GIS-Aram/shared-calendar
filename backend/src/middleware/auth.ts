import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            console.log('No token found');
            return res.status(401).json({ message: "Authentication failed" });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string, id: string };
        req.userId = decodedToken.id;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: "Authentication failed" });
    }
};

export default auth;