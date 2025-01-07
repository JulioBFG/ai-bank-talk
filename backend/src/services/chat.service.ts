import { supabase } from '../config/supabaseClient';

export const chatService = {
  async sendMessage(message: string, userId: string): Promise<string> {
    console.log(`Mensagem recebida do usuário ${userId}: ${message}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const aiResponse = `Resposta da IA para: ${message}`;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ userId, userMessage: message, aiResponse }])
        .select('*')
        .single();

      if (error) {
        console.error("Error inserting message into database", error);
        throw error;
      }

      console.log("Saved Message on database:", data);
      return aiResponse;
    } catch (error) {
      console.error("Error on chat service:", error);
      throw error;
    }
  },
};