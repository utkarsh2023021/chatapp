const express = require("express");
const http = require('http');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const path = require('path');
const port = 3000;
const mongoose = require("mongoose");
const userRoute = require('./routes/user');
const User = require("./models/user");
const bodyParser = require('body-parser');
const io =socketio(server);



mongoose.connect('mongodb+srv://catci142:catci142@cluster0.oyfmupl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/auth')
.then(()=> console.log("MongoDb connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async(req,res)=>{
    return res.render('home');
});


io.on('connection', (socket) => {
  console.log('new user connected');

  socket.on('joining msg', (name) => {
      console.log(name + ' has joined the chat');
      socket.name = name; // Store the user's name in the socket object
      io.emit('user joined', name);
  });

  socket.on('disconnect', () => {
      const name = socket.name; // Retrieve the user's name from the socket object
      console.log(name + ' user disconnected');
      io.emit('user left', name);
  });

  socket.on('chat message', (msg) => {
      socket.broadcast.emit('chat message', msg);
  });
});


/*app.post("/signup", async(req,res)=>{
    const { name, email, password } = req.body;
    await User.create({
      name,
      email,
      password,
    });
    console.log("reached here");
    return res.render("home");
});*/


app.use("/user", userRoute);



server.listen(port,()=> console.log(`server started at: ${port}`))

