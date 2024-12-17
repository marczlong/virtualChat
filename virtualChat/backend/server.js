const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

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

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
