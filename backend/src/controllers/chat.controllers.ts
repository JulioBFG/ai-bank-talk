import { Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service';
import { User } from '../models/user.model';

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = req.body.message;
    const user = req.user as User;
    const userId = user.id;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória.' });
    }

    const response = await chatService.sendMessage(message, userId);
    res.json({ response });
  } catch (error) {
    next(error);
  }
};