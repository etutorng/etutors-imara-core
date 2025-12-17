import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import { parse } from "url";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url!, true);
            await handler(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        // Join a specific counselling session room
        socket.on("join_session", (sessionId) => {
            socket.join(`session_${sessionId}`);
            console.log(`Socket ${socket.id} joined session_${sessionId}`);
        });

        // Chat events
        socket.on("send_message", (data) => {
            const { sessionId, senderId, content, id, createdAt } = data;

            // Broadcast to everyone in the room (including sender, or exclude sender?)
            // Usually valid to broadcast to all, client handles de-dupe.
            // Or broadcast to others: socket.to(...).emit
            // Let's broadcast to Room so everyone stays in sync.
            io.to(`session_${sessionId}`).emit("receive_message", {
                id: id || Date.now().toString(),
                sessionId,
                senderId,
                content,
                createdAt: createdAt || new Date(),
            });
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
