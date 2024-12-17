const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Leer el encabezado de autorización
  const authHeader = req.header('Authorization');
  console.log('Encabezado Authorization recibido:', authHeader); // Depuración

  // Verificar que el encabezado existe y tiene el formato correcto
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token válido.' });
  }

  // Extraer el token después de "Bearer "
  const token = authHeader.split(' ')[1];

  try {
    // Verificar el token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verificado:', verified); // Depuración
    req.user = verified; // Adjuntar los datos del usuario al objeto req
    next(); // Continuar con la siguiente función
  } catch (err) {
    console.error('Error verificando el token:', err.message); // Depuración
    res.status(400).json({ message: 'Token no válido.' });
  }
};

module.exports = verifyToken;
