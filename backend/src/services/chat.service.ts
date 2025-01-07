export const chatService = {
  async sendMessage(message: string): Promise<string> {
    return `Resposta da IA para: ${message}`;
  },
};