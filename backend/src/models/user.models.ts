import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  // ... outros campos
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  // ... outros campos
});

export default mongoose.model<IUser>('User', userSchema);