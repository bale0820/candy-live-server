import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { connectMongo } from "./config/mongo";
import { Chat } from "./schema/chatSchema";
import jwt from "jsonwebtoken";
import cors from "cors";
import { userRepository } from "./repository/userRepository";
connectMongo();
const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "https://candy-frontend-taupe.vercel.app"], // 허용할 프론트 주소
    credentials: true               // 쿠키/인증 허용
}));


app.get("/chat/:roomId", async (req, res) => {

    const roomId = req.params.roomId;

    const chats = await Chat.find({
        roomId
    })
        .sort({ createdAt: 1 })
        .limit(50);
    res.json(chats);

});



const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.use(async (socket, next) => {

    try {

        const token = socket.handshake.auth.token;

        console.log("TOKEN:", token);
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        ) as { id: number };



        // DB 조회
        const name = await userRepository.findById(
            decoded.id
        );

        if (!name) {

            return next(
                new Error("user not found")
            );

        }

        // socket에 저장
        socket.data.user = {
            name,
            id: decoded.id
        };
        next();

    } catch (err) {

        console.log(err);
        const error: any = new Error("unauthorized");

        error.data = {
            status: 401
        };

        next(error);

    }

});

io.on("connection", (socket) => {

    console.log("user connected");

    // room 입장
    socket.on("join_room", (roomId) => {

        socket.join(roomId);

        console.log(`join room : ${roomId}`);

    });

    // 채팅

    socket.on("chat", async (data) => {
        console.log("on");
        // JWT 사용자
        const user = socket.data.user;

        const chatData = {

            roomId: data.roomId,

            userPk: user.id,

            name: user.name,

            message: data.message

        };

        // Mongo 저장
        await Chat.create(chatData);

        // 실시간 전송
        io.to(data.roomId).emit("chat", chatData);

    });

});

server.listen(8081, "0.0.0.0", () => {
    console.log("socket server running");
});