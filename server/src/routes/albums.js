import express from 'express'
import mongoose from 'mongoose'
import { AlbumModel } from '../models/Albums.js'
import { UserModel } from '../models/Users.js'
import { verifyToken } from './users.js'
const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const resp = await AlbumModel.find()
    res.send({ message: 'ad' })
  } catch (error) {
    res.send(error)
  }
})

router.post('/', verifyToken, async (req, res) => {
  const albums = new AlbumModel(req.body)
  console.log(req.body)
  try {
    const resp = await albums.save()
    res.send(resp)
  } catch (error) {
    res.send(error)
  }
})

// 관심 앨범 추가, 제거
router.put('/', verifyToken, async (req, res) => {
  const { albumID, userID } = req.body
  const album = await AlbumModel.findById(albumID)
  const user = await UserModel.findById(userID)
  const nullCheck = user.like.filter(i => i !== null)
  const hasAlbum = nullCheck.findIndex(i => i.equals(albumID))

  if (hasAlbum >= 0) {
    const newLike = [...user.like]
    newLike.splice(hasAlbum, 1)
    user.like = newLike
    await user.save()
    return res.send({ like: user.like })
  }
  user.like.push(album)
  await user.save()
  res.send({ like: user.like })
})

router.get('/like/:id', async (req, res) => {
  const { id } = req.params
  try {
    const user = await UserModel.findById(id)
    res.send({ like: user.like })
  } catch (error) {
    res.send(error)
  }
})

router.get('/likes/:id', async (req, res) => {
  const { id } = req.params
  console.log(id)
  try {
    const user = await UserModel.findById(id)
    const likeUser = await AlbumModel.find({
      _id: { $in: user.like }
    })
    res.send({ likeUser })
  } catch (error) {
    res.send(error)
  }
})

export { router as albumRouter }