const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
require('dotenv').config(); // Cargar variables de entorno

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'El email ya está registrado' });

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear y guardar el usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      walletBalance: 1000,
      friends: [],
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado correctamente', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Comparar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const verifyToken = require('../middleware/auth'); // Importar el middleware

// Obtener todos los usuarios (requiere autenticación)
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find(); // Busca todos los usuarios
    res.status(200).json(users); // Devuelve la lista de usuarios
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para eliminar un usuario (requiere autenticación)
router.delete('/delete', verifyToken, async (req, res) => {
  try {
    // Obtener el ID del usuario autenticado
    const userId = req.user.id;

    // Buscar y eliminar el usuario
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado correctamente', user: deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para agregar un amigo
router.post('/add-friend', verifyToken, async (req, res) => {
  const { friendId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(friendId);

    if (!friend) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Verificar si ya son amigos
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: 'Este usuario ya es tu amigo' });
    }

    // Agregar amigo
    user.friends.push(friendId);
    await user.save();

    res.json({ message: 'Amigo agregado correctamente', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta para consultar el saldo de la billetera
router.get('/wallet', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ walletBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

/*const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Asegúrate de que este modelo exista

// Ruta para registrar un usuario
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body); // Crear un nuevo usuario con los datos del cuerpo de la solicitud
    await user.save(); // Guardar en la base de datos
    res.status(201).json({ message: 'Usuario registrado correctamente', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Busca todos los usuarios en la base de datos
    res.status(200).json(users); // Devuelve los usuarios como respuesta en formato JSON
  } catch (err) {
    res.status(500).json({ error: err.message }); // Maneja errores
  }
});

te llamé porque te quería preguntar

viste que ayer te mostré una comunicación del SOC por el tema del Dardo y estar como demandante de empleo. Me ponían que la renueve antes del 17 de dic. Pero claro al tener el NIE vencido no se puede. En teoría Jose la renovó el 4 de dic y se ve que se cayó. Ya veo que vamos a tener problemas con eso 

module.exports = router;
*/