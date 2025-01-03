import { Request, Response, NextFunction } from 'express';
import { chatService } from '../services/chat.service';

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const message = req.body.message;
    const userId = req.user._id; // Obtem o ID do usuário autenticado

    if (!message) {
      return res.status(400).json({ error: 'Mensagem é obrigatória.' });
    }

    const response = await chatService.sendMessage(message, userId); // Chama o serviço
    res.json({ response });

  } catch (error) {
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
};