import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'albums' }]
})

export const UserModel = mongoose.model("users", UserSchema)