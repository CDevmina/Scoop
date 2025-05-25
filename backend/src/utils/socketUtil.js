const { Server } = require('socket.io');
let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    // Join showtime room
    socket.on('join-showtime', (showtimeId) => {
      socket.join(`showtime-${showtimeId}`);
    });

    // Leave showtime room
    socket.on('leave-showtime', (showtimeId) => {
      socket.leave(`showtime-${showtimeId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = { initializeSocket, getSocketIO: () => io };