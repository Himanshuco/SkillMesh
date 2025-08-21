const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/User");
const Message = require('./models/message');
const onlineUsers = new Map();

require("dotenv").config();

const skillRoutes = require('./routes/skills');
const authRoutes = require("./routes/authRoutes");
const homeRoute = require("./routes/home");
const userDashboard = require("./routes/user");
const chatRoute = require('./routes/chat');
const projectRoutes = require('./routes/project');
const sessionRoutes = require('./routes/session');


const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/skillmesh";

// Connect to MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../client/views"));

// Middleware
app.use(express.static(path.join(__dirname, "../client/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Session config
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "xyzz",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: MONGO_URL }),
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 3 }
});
app.use(sessionMiddleware);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use("/", homeRoute);
app.use("/", authRoutes);
app.use("/user", userDashboard);
app.use("/skills", skillRoutes);
app.use("/", chatRoute);
app.use('/chat', chatRoute);
app.use('/user/:id/projects', projectRoutes);
app.use('/projects', projectRoutes);
app.use('/', sessionRoutes);



// ----- SOCKET.IO -----

io.on('connection', socket => {
  // console.log('Socket connected:', socket.id);

  // User joins personal room by their userId
  socket.on('joinUserRoom', (userId) => {
    socket.userId = userId;
    socket.join(userId);
    // console.log(`User ${userId} joined their personal room`);
  });

  // User joins chat room between sender & recipient
  socket.on('joinRoom', ({ senderId, recipientId }) => {
    if (!senderId || !recipientId) return;

    socket.senderId = senderId;
    socket.recipientId = recipientId;

    const roomId = [senderId, recipientId].sort().join('_');
    socket.join(roomId);
    // console.log(`${senderId} joined room ${roomId}`);

    // Mark user online
    onlineUsers.set(senderId, { socketId: socket.id, lastSeen: null });
    broadcastUserStatus(senderId);
  });

  // New chat message
  socket.on('chatMessage', async ({ recipientId, content }) => {
    const senderId = socket.senderId;
    if (!senderId || !recipientId || !content) return;

    const roomId = [senderId, recipientId].sort().join('_');
    const msg = await Message.create({ sender: senderId, recipient: recipientId, roomId, text: content });
    const sender = await User.findById(senderId);

    // Emit message to chat room participants
    io.to(roomId).emit('chatMessage', {
      senderId,
      senderName: sender.username,
      text: msg.text,
      createdAt: msg.createdAt
    });
    // console.log('Message saved & sent in room', roomId);

    // Notify both sender and recipient to update their chat list UI
    io.to(senderId).emit('chatListUpdate');
    io.to(recipientId).emit('chatListUpdate');
  });

  socket.on('disconnect', () => {
    const sid = socket.senderId;
    if (!sid) return;
    onlineUsers.set(sid, { socketId: null, lastSeen: new Date() });
    broadcastUserStatus(sid);
    // console.log(`${sid} disconnected`);
  });

  //16/08
  socket.on('join-video-room', ({ roomId }) => {
    socket.join(roomId);
    const clients = io.sockets.adapter.rooms.get(roomId) || new Set();
    if (clients.size > 1) {
      socket.to(roomId).emit('ready');
    }
  });

  socket.on('offer', ({ offer, roomId }) => {
    socket.to(roomId).emit('offer', { offer });
  });

  socket.on('answer', ({ answer, roomId }) => {
    socket.to(roomId).emit('answer', { answer });
  });

  socket.on('ice-candidate', ({ candidate, roomId }) => {
    socket.to(roomId).emit('ice-candidate', { candidate });
  });


});

function broadcastUserStatus(userId) {
  const info = onlineUsers.get(userId) || { socketId: null, lastSeen: null };
  io.emit('userStatus', {
    userId,
    online: !!info.socketId,
    lastSeen: info.lastSeen
  });
  // console.log('Broadcasting status for', userId, !!info.socketId);
}


// Start server
server.listen(PORT, '0.0.0.0',  () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});