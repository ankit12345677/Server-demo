const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const cors = require("cors");
const { Console } = require("console");

const app = express();
const PORT = process.env.PORT

const users = [{}]

app.use(cors())
app.get("/", (req, res) => {
    res.send("Hellow i am ankit here")
})

const server = http.createServer(app)

const io = socketIo(server)

io.on("connection", (socket) => {
    console.log("New connection")
    socket.on("joined", ({ user }) => {
        users[socket.id] = user
        console.log(`${user} has joined`)
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has Joined`})
        socket.emit('welcome', { user: "Admin", message: `Welcome to the chat,${users[socket.id]}`})
    })
    
    socket.on('message', ({message,id}) => {
        io.emit('sendMessage',{user:users[id],message,id})
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]} has left`})
        console.log('User left')
    })
})

server.listen(PORT, () => {
    console.log(`server is running on the ${PORT}`)
})

