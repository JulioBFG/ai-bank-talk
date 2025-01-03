export const chatService = {
    async sendMessage(message: string, userId: string): Promise<string> {
        // Aqui você integraria com a API de IA (ex: OpenAI, Gemini, etc.)
        // Incluir o userId no contexto da requisição para personalização
        console.log(`Mensagem recebida do usuário ${userId}: ${message}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simula um atraso
        return `Resposta da IA para: ${message}`;
    },
};