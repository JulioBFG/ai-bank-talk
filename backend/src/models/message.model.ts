export interface Message {
  id: string;
  userId: string;
  userMessage: string;
  aiResponse: string;
  createdAt?: Date;
  updatedAt?: Date;
}