require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const configRoutes = require('./routes/configRoutes');
const watchConfigs = require('./utils/watcher');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
         cors: {
                  origin: '*',
                  methods: ['GET', 'POST']
         }
});

app.use(cors());
app.use(express.json());

// Attach io to app to use in controllers
app.set('socketio', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/configs', configRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
         .then(() => console.log('Connected to MongoDB'))
         .catch(err => console.error('MongoDB connection error:', err));

// Initialize File Watcher
watchConfigs(io);

io.on('connection', (socket) => {
         console.log('New client connected:', socket.id);

         socket.on('subscribe', (room) => {
                  socket.join(room);
                  console.log(`Socket ${socket.id} joined room: ${room}`);
         });

         socket.on('disconnect', () => {
                  console.log('Client disconnected');
         });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
         if (err.code === 'EADDRINUSE') {
                  console.error(`❌ Port ${PORT} is already in use. Kill the other process first.`);
                  process.exit(1);
         } else {
                  console.error('Server error:', err);
         }
});

// Catch unhandled errors so the process doesn't silently crash
process.on('uncaughtException', (err) => {
         console.error('❌ Uncaught Exception:', err.message);
         console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
         console.error('❌ Unhandled Promise Rejection:', reason);
});
