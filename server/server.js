import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
    origin: allowedOrigins,
    credentials:true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
