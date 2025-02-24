// WebSocket server configuration using the same app on which the Express server is running...
const { app } = require("./../app");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const BACKEND_URL =
    process.env.NODE_APP_ENV === "Production"
        ? process.env.NODE_APP_PRODUCTION_BACKEND_URL
        : process.env.NODE_APP_LOCAL_BACKEND_URL;

        const FRONTEND_URL =
        process.env.NODE_APP_ENV === "Production"
            ? process.env.NODE_APP_PRODUCTION_FRONTEND_URL
            : process.env.NODE_APP_LOCAL_FRONTEND_URL;

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL, // Replace with your NODE app URL
    methods: ["GET", "POST"],
  },
});

// Database models or collections
const meets = require("./../Models/meets");

const emailToSocketIdMap = new Map();
const meetingRooms = new Map();

io.on("connection", (socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  socket.on("room:join", ({ email, room }) => {
    console.log(`Server (room:join): Email: ${email}, Room: ${room}`);

    if (!meetingRooms.has(room)) {
      meetingRooms.set(room, { admin: null, user: null });
    }

    const roomData = meetingRooms.get(room);

    if (email === "admin@gmail.com") {
      roomData.admin = socket.id;
      socket.emit("room:joined", { role: "admin", meetingId: room });
      console.log(`Admin joined meeting ${room}`);
    } else {
      roomData.user = socket.id;
      socket.emit("room:joined", { role: "user", meetingId: room });
      console.log(`User joined meeting ${room}`);
    }

    // Notify the counterpart (admin <-> user)
    if (roomData.admin && roomData.user) {
      io.to(roomData.admin).emit("peer:joined", {
        role: "user",
        meetingId: room,
      });
      io.to(roomData.user).emit("peer:joined", {
        role: "admin",
        meetingId: room,
      });
      console.log(`Admin and User connected in meeting ${room}`);
    }
  });


  socket.on("user:call", ({ email, room, offer }) => {
    console.log(email,room,offer);
    const roomData= meetingRooms.get(room);
    if(!roomData) return;
    if(!roomData.admin) return;
    io.to(roomData.admin).emit("user:call",{offer});
  });


  socket.on("user:answer", ({ email, room, answer }) => {
    console.log("Got answer",email,room,answer);
    const roomData= meetingRooms.get(room);
    if(!roomData) return;
    if(!roomData.user) return;
    io.to(roomData.user).emit("user:answer",{answer});
  });

  socket.on("user:done", ({ email, room }) => {
    console.log("Got answer",email,room);
    const roomData= meetingRooms.get(room);
    if(!roomData) return;
    if(!roomData.admin) return;
    io.to(roomData.admin).emit("user:done");
  });

  socket.on("nego:offer", ({ email, room,offer }) => {
    console.log("Got neg offer",email,room);
    const roomData= meetingRooms.get(room);
    if(!roomData) return;
    if(email == 'user@gmail.com'){
      if(!roomData.admin) return;
      io.to(roomData.admin).emit("nego:offer",{offer});
    }else{
      if(!roomData.user) return;
      io.to(roomData.user).emit("nego:offer",{offer});
    }
  });

  socket.on("nego:answer", ({ email, room,answer }) => {
    console.log("Got neg answer",email,room);
    const roomData= meetingRooms.get(room);
    if(!roomData) return;
    if(email == 'user@gmail.com'){
      if(!roomData.admin) return;
      io.to(roomData.admin).emit("nego:answer",{answer});
    }else{
      if(!roomData.user) return;
      io.to(roomData.user).emit("nego:answer",{answer});
    }
  });

  socket.on("nego:done", ({ email, room }) => {
    console.log("Got neg done",email,room);
    const roomData= meetingRooms.get(room);
    if(!roomData) return;
      if(!roomData.admin || !roomData.user) return;
      io.to(roomData.admin).emit("nego:done");
      io.to(roomData.user).emit("nego:done");
  });


  socket.on("room:leave", ({ email, room }) => {
    console.log(`${email} is leaving the room: ${room}`);

    const roomData = meetingRooms.get(room);
    if (!roomData) return;

    const role = email === "admin@gmail.com" ? "Admin" : "User";

    // Notify the remaining participant
    if (roomData.admin === socket.id) {
      io.to(roomData.user).emit("peer:left", { role, meetingId: room });
      roomData.admin = null;
    } else if (roomData.user === socket.id) {
      io.to(roomData.admin).emit("peer:left", { role, meetingId: room });
      roomData.user = null;
    }

    // Remove room if empty
    if (!roomData.admin && !roomData.user) {
      meetingRooms.delete(room);
    }
  });

  socket.on("disconnect", () => {
    console.log(`Socket Disconnected: ${socket.id}`);

    for (const [room, roomData] of meetingRooms.entries()) {
      if (roomData.admin === socket.id) {
        io.to(roomData.user).emit("peer:left", {
          role: "Admin",
          meetingId: room,
        });
        roomData.admin = null;
      } else if (roomData.user === socket.id) {
        io.to(roomData.admin).emit("peer:left", {
          role: "User",
          meetingId: room,
        });
        roomData.user = null;
      }

      if (!roomData.admin && !roomData.user) {
        meetingRooms.delete(room);
      }
    }
  });

 

  socket.on("call:accepted", ({ to, ans }) => {
    console.log("Server (call:accepted): to , ans", to, ans);
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("setting:update", ({ to }) => {
    console.log("Updating settings by", to);
    io.to(to).emit("setting:update", { from: socket.id });
  });

  socket.on("cut", ({ to }) => {
    console.log("Disconnecting", to);
    io.to(to).emit("cut", { from: socket.id });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("Server (peer:nego:needed): to , offer", to, offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("Server (peer:nego:done): to , ans", to, ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});

module.exports = server;
