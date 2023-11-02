import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/Users.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body
  const users = await UserModel.find()
  console.log(users)
  if (email === '') {
    return res.send({ message: "이미 등록된 이메일입니다.", status: 'error' })
  }

  // req.body에서 넘어온 email을 UserModel에서 찾는다.
  // UserModel에 eamil이 존재하는 경우 이미 등록되어 있는 email이니
  // 더 이상 진행이 되지 않도록 return해준다.
  const user = await UserModel.findOne({ email })
  if (user) {
    return res.send({ message: "이미 등록된 이메일입니다.", status: 'error' })
  }

  // 비밀번호를 평문으로 저장하는 경우 보안 취약점이 생기니 bcrypt를 사용해 암호화 해준다.
  const hashPassword = await bcrypt.hash(password, 10)

  // 새로운 유저를 생성하고 데이터 베이스에 저장
  const newUser = new UserModel({
    email, username, password: hashPassword
  })
  await newUser.save()

  res.send({ message: "성공적으로 등록되었습니다.", status: 'sucess' })
})
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await UserModel.findOne({ email })
  console.log(user, email, password)

  if (!user) {
    return res.send({ message: "이메일 또는 비밀번호가 일치하지 않습니다." })
  }
  const comparePassword = await bcrypt.compare(password, user.password)
  if (!comparePassword) {
    return res.send({ message: "이메일 또는 비밀번호가 일치하지 않습니다." })
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
  res.json({ token, userID: user._id, username: user.username })
})

export { router as userRouter }

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.status(403).send({ message: err })
      }
      next()
    })
  } else {
    console.log('토큰이 존재하지 않습니다.')
    res.status(401)
  }
}
