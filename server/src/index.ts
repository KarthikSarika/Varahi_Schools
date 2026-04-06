import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { env } from './utils/env';

const app = express();
const prisma = new PrismaClient();
const PORT = env.PORT;

app.use(cors({
    origin: [
        'https://varahi-schools.vercel.app',
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Varahi Schools API is running...');
});

// Import routes
import authRoutes from './routes/auth';
import adminRoutes from './routes/adminRoutes';
import teacherRoutes from './routes/teacherRoutes';
import studentRoutes from './routes/studentRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { prisma };
