//import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const passportSetup = require('./config/passport-setup');
const authRoutes = require('./routes/auth');
const path = require('path');
const http = require('http');  // Add this line
const socketIo = require('socket.io');  // Add this line


require("dotenv").config();

//app
const app = express();
// Use session to keep track of login state

const server = http.createServer(app);  // Change this line

const io = socketIo(server);  // Add this line

app.use(require('express-session')({ secret: 'mysecretkey170904', resave: false, saveUninitialized: false }));
app.use(passportSetup.initialize());
app.use(passportSetup.session());

//db
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("DB CONNECTED")).catch(err => console.log("DB CONNECTION ERROR", err));
//middleware
app.use('/postedbooks', express.static(path.join(__dirname, 'postedbooks')));
app.use(morgan("dev"));
app.use(express.json())
app.use(
  cors({
    origin:["http://localhost:3000", "https://ubookfront.onrender.com"],
  })
);
// app.post('/api/register',(req,res)=> {
//     console.log(req.body)
//     res.json({status: 'ok'})  
// })
//routes
app.use("/", require('./routes/user'));
app.use('/auth', authRoutes);
app.use("/userview", require('./routes/userview'));
app.use("/cartview", require('./routes/cartview'));
app.use("/admin", require('./routes/admin'));
app.use("/rentedbooks", require('./routes/rentedbooks'));
app.use("/profile", require('./routes/profile'));
app.use("/rentedout", require('./routes/RentedOutBooks'));
app.use("/messages", require('./routes/messages'));
//ports
//const port  = process.env.PORT || 8080;
const port = 8080;
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('disconnect', () => {
      console.log('User disconnected');
  });
});
server.listen(port, () =>
    console.log(`Server is running on port ${port}`)
);

module.exports = { app, server, io };