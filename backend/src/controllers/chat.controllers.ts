import { Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service';


export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória.' });
    }

    const response = await chatService.sendMessage(message);
    res.json({ response });

  } catch (error) {
    next(error);
  }
};