import mongoose from 'mongoose'

const AlbumSchema = new mongoose.Schema({
  albumName: { type: String, required: true },
  songName: [{ type: String, required: true }],
  imgUrl: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }
})
export const AlbumModel = mongoose.model("albums", AlbumSchema)