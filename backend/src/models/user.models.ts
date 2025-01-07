import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
}

const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
});

export default mongoose.model<IUser>('User', userSchema);