// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const http = require('http'); 
const { Server } = require("socket.io"); // Importa la clase Server

dotenv.config(); // Cargar variables de entorno

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect('mongodb://localhost:27017/virtualworld', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB conectado correctamente'))
  .catch((err) => console.error('Error conectando a MongoDB:', err));

// Conectar las rutas de usuario con prefijo '/api/users'
const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

// Crea el servidor HTTP
const server = http.createServer(app);
const socketIO = new Server(server, { 
  cors: {
    origin: "http://localhost:3002", 
    methods: ["GET", "POST"]
  }
});


// Maneja la conexión de Socket.IO
socketIO.on('connection', (socket) => { // Cambiado a 'socketIO'
  console.log('Un usuario se ha conectado');

  socket.on('sendMessage', (message) => {
    // Guardar el mensaje en la base de datos (implementar)
    socketIO.emit('newMessage', message); // Cambiado a 'socketIO'
  });

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado');
  });
});


// Iniciar el servidor HTTP (en lugar de app.listen)
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));