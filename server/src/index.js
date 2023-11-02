import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import http from 'http'
import { Server } from 'socket.io'
import { userRouter } from './routes/users.js'
import { albumRouter } from './routes/albums.js'

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors())

// const server = http.createServer(app)
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ["GET", "POST"]
//   }
// })

// io.on('connection', (socket) => {
//   console.log(`${socket.id}`)
//   socket.on('send_message', (data) => {
//     socket.broadcast.emit('my_message', data)
//     // socket.broadcast.emit('receive_message', data)
//   })
// })

app.use('/auth', userRouter)
app.use('/albums', albumRouter)

const PORT = process.env.PORT || 8000
mongoose.connect(process.env.DB_URL)

// server.listen(parseInt(PORT) + 1, () => console.log(`listen on ${parseInt(PORT) + 1}`))
app.listen(PORT, () => console.log(`listen on ${PORT}`))