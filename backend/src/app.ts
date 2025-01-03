import express from 'express';
import cors from 'cors';
import { errorHandler } from 'middlewares/error.middleware';
import chatRoutes from 'routes/chat.routes';
import authRoutes from 'routes/auth.routes';
import { connectToDatabase } from 'config/db';
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;