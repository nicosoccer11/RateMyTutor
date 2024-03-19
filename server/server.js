const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io') // TODO: Move this
require('dotenv').config();

// Add Routes here
const userRoutes = require('./routes/userRoutes');
const postsRoutes = require('./routes/postsRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const friendRoutes = require('./routes/friendRoutes');
const messageRoutes = require('./routes/messageRoutes');
const qualificationRoutes = require('./routes/qualificationRoutes');
const educationRoutes = require('./routes/educationRoutes');
const imageRoutes = require('./routes/imageRoutes');
//Add Routes here

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Use the user routes
app.use(userRoutes);
// Use the posts routes
app.use(postsRoutes);
// Use the reviews routes
app.use(reviewsRoutes);
// Use the friend routes
app.use(friendRoutes);
// Use the message routes
app.use(messageRoutes);
// Use the qualification routes
app.use(qualificationRoutes);
// Use the education routes
app.use(educationRoutes);
// Use the image routes
app.use(imageRoutes);


const server = app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

// Socket io instance
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection",(socket) =>{
  console.log(socket.id);

  socket.on("join_room", (data) =>{
    socket.join(data); // id of room joined
    console.log(`user with id: ${socket.id} joined room: ${data}`, )
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message",data);
  });

  socket.on("disconnect", ()=>{
    console.log("User disconnected", socket.id);
  });
});