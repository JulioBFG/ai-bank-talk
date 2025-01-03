import express from 'express';
import { sendMessage } from '../controllers/chat.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Rota protegida por autenticação
router.post('/', authenticate, sendMessage);

export default router;