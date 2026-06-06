// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import { connectMongo } from "./config/mongo";
// import { Chat } from "./schema/chatSchema";
// import jwt from "jsonwebtoken";
// import cors from "cors";
// import { userRepository } from "./repository/userRepository";
// connectMongo();
// const app = express();
// app.use(cors({
//     origin: ["http://localhost:3000", "https://candy-frontend-taupe.vercel.app"], // 허용할 프론트 주소
//     credentials: true               // 쿠키/인증 허용
// }));


// app.get("/live/chat/:roomId", async (req, res) => {

//     const roomId = req.params.roomId;

//     const chats = await Chat.find({
//         roomId
//     })
//         .sort({ createdAt: 1 })
//         .limit(50);
//     res.json(chats);

// });



// const server = http.createServer(app);

// const io = new Server(server, {

//     path: "/live/socket.io",

//     cors: {
//         origin: "*"
//     }

// });
// io.use(async (socket, next) => {

//     try {

//         const token = socket.handshake.auth.token;

//         console.log("TOKEN:", token);
//         const decoded = jwt.verify(
//             token,
//             process.env.JWT_SECRET!
//         ) as { id: number };



//         // DB 조회
//         const name = await userRepository.findById(
//             decoded.id
//         );

//         if (!name) {

//             return next(
//                 new Error("user not found")
//             );

//         }

//         // socket에 저장
//         socket.data.user = {
//             name,
//             id: decoded.id
//         };
//         next();

//     } catch (err) {

//         console.log(err);
//         const error: any = new Error("unauthorized");

//         error.data = {
//             status: 401
//         };

//         next(error);

//     }

// });

// io.on("connection", (socket) => {

//     console.log("user connected");

//     // room 입장
//     socket.on("join_room", (roomId) => {

//         socket.join(roomId);

//         console.log(`join room : ${roomId}`);

//     });

//     // 채팅

//     socket.on("chat", async (data) => {
//         console.log("on");
//         // JWT 사용자
//         const user = socket.data.user;

//         const chatData = {

//             roomId: data.roomId,

//             userPk: user.id,

//             name: user.name,

//             message: data.message

//         };

//         // Mongo 저장
//         await Chat.create(chatData);

//         // 실시간 전송
//         io.to(data.roomId).emit("chat", chatData);

//     });


//     socket.on("offer", (data) => {

//         socket
//             .to(data.roomId)
//             .emit(
//                 "offer",
//                 data.offer
//             );

//     });


//     socket.on("answer", (data) => {

//         socket
//             .to(data.roomId)
//             .emit(
//                 "answer",
//                 data.answer
//             );

//     });

//     socket.on(
//         "ice-candidate",
//         (data) => {

//             socket
//                 .to(data.roomId)
//                 .emit(
//                     "ice-candidate",
//                     data.candidate
//                 );

//         }
//     );



// });

// server.listen(8081, "0.0.0.0", () => {
//     console.log("socket server running");
// });


import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cors from "cors";

import { connectMongo } from "./config/mongo";
import { Chat } from "./schema/chatSchema";
import { userRepository } from "./repository/userRepository";
import { productRoutes } from "./routes/productRoutes";
import { promisePool } from "./config/db";
import { ResultSetHeader } from "mysql2";
import { authMiddleware } from "./utils/authMiddleware";
import { liveRoutes } from "./routes/liveRoutes";

// =========================
// Mongo 연결
// =========================
connectMongo();

// =========================
// express 생성
// =========================
const app = express();

app.use(express.json());
// =========================
// cors
// =========================
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://candy-frontend-taupe.vercel.app"
        ],
        credentials: true
    })
);

// =========================
// 채팅 조회 API
// =========================
app.get(
    "/live/chat/:roomId",
    async (req, res) => {

        const roomId =
            req.params.roomId;

        const chats =
            await Chat.find({
                roomId
            })
                .sort({
                    createdAt: 1
                })
                .limit(50);

        res.json(chats);

    }
);

// =========================
// http server
// =========================
const server =
    http.createServer(app);

// =========================
// socket.io
// =========================
const io =
    new Server(server, {

        path: "/live/socket.io",

        cors: {
            origin: "*"
        }

    });

// =========================
// socket JWT 인증
// =========================
io.use(
    async (socket, next) => {

        try {

            const token =
                socket.handshake
                    .auth.token;

            console.log(
                "TOKEN:",
                token
            );

            const decoded =
                jwt.verify(
                    token,
                    process.env.JWT_SECRET!
                ) as {
                    id: number
                };

            // 유저 조회
            const name =
                await userRepository.findById(
                    decoded.id
                );

            if (!name) {

                return next(
                    new Error(
                        "user not found"
                    )
                );

            }

            // socket 저장
            socket.data.user = {

                id: decoded.id,

                name

            };

            next();

        } catch (err) {

            console.log(err);

            const error: any =
                new Error(
                    "unauthorized"
                );

            error.data = {
                status: 401
            };

            next(error);

        }

    }
);

// =========================
// socket 연결
// =========================
io.on(
    "connection",
    (socket) => {

        console.log(
            "user connected"
        );

        // =========================
        // room 입장
        // =========================
        socket.on(
            "join_room",
            (roomId) => {

                socket.join(roomId);

                console.log(
                    `join room : ${roomId}`
                );

                // room 안 사람에게 알림
                socket
                    .to(roomId)
                    .emit(
                        "viewer_joined"
                    );

            }
        );

        // =========================
        // 채팅
        // =========================
        socket.on(
            "chat",
            async (data) => {

                const user =
                    socket.data.user;

                const chatData = {

                    roomId:
                        data.roomId,

                    userPk:
                        user.id,

                    name:
                        user.name,

                    message:
                        data.message

                };

                // mongo 저장
                await Chat.create(
                    chatData
                );

                // room 전체 전송
                io.to(data.roomId)
                    .emit(
                        "chat",
                        chatData
                    );

            }
        );

        // =========================
        // offer 전달
        // =========================
        socket.on(
            "offer",
            (data) => {

                socket
                    .to(data.roomId)
                    .emit(
                        "offer",
                        data.offer
                    );

            }
        );

        // =========================
        // answer 전달
        // =========================
        socket.on(
            "answer",
            (data) => {

                socket
                    .to(data.roomId)
                    .emit(
                        "answer",
                        data.answer
                    );

            }
        );

        // =========================
        // ICE 전달
        // =========================
        socket.on(
            "ice-candidate",
            (data) => {

                socket
                    .to(data.roomId)
                    .emit(
                        "ice-candidate",
                        data.candidate
                    );

            }
        );

        // =========================
        // 연결 종료
        // =========================
        socket.on(
            "disconnect",
            () => {

                console.log(
                    "socket disconnect"
                );



            }
        );

        socket.on(
            "broadcast_end",
            async (roomId) => {

                console.log(
                    "broadcast end:",
                    roomId
                );

                try {
                    await promisePool.query(
                        `
                        DELETE FROM live_broadcast
                        WHERE room_id = ?
                        `,
                        [roomId]
                    );
                } catch (err) {
                    console.log(
                        "broadcast end delete failed:",
                        err
                    );
                }

                io.to(roomId).emit(
                    "broadcast_end"
                );

            }
        );

    }
);



app.delete(
    "/live/:roomId",
    async (req, res) => {

        const roomId =
            req.params.roomId;

        await promisePool.query(
            `
            DELETE FROM live_broadcast
            WHERE room_id = ?
            `,
            [roomId]
        );

        res.json({
            message: "방송 종료"
        });

    }
);






app.use('/live/product', productRoutes);
app.use(
    "/live",
    liveRoutes
);
// =========================
// server 실행
// =========================
const PORT =
    Number(process.env.PORT) || 8081;
    

server.listen(PORT, "0.0.0.0", () => {

    console.log(
        `server start!!!!! : ${PORT}`
    );

});
