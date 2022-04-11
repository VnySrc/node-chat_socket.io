import express from "express"
import path from "path"
import http from "http"
import dotenv from "dotenv"
import {Server} from "socket.io"


dotenv.config()
const __dirname = path.resolve();

const app = express()
const server = http.createServer(app)
const io = new Server(server)

server.listen(process.env.SERVER_PORT, () => {
    console.log("Server Funcionando")
})

app.use(express.static(path.join(__dirname, "public")))

let connectedUsers = [];

io.on("connection", (socket) => {
    console.log("Conexao Bem Sucedida")
  
    socket.on("join-request", (username) => { //Recive username
        socket.username = username
        connectedUsers.push(username)

       let data = {
            join: socket.username,
            username: socket.username,
            list: connectedUsers
        }

        socket.emit("user-list", data) // Emit username
        socket.broadcast.emit("users-update", data) // Emit broadcast update

    })
    socket.on("disconnect", () => {
       connectedUsers = connectedUsers.filter(u => u != socket.username)

       let data1 = {
        left: socket.username,
        list: connectedUsers,
    }

        socket.broadcast.emit("users-update", data1)
    })
    socket.on("send-message", (message) => {
        
        let obj = {
            username: socket.username,
            message: message
        };

        socket.emit("message-list", obj)
        socket.broadcast.emit("messages-update", obj)
        console.log(obj.message)
        
    })
})