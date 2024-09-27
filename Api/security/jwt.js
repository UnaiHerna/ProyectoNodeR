const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const app = express();

// Secret key to encode and decode JWT tokens
const SECRET_KEY = 'your-secret-key'; // Usa variables de entorno en producción
const ALGORITHM = 'HS256';
const ACCESS_TOKEN_EXPIRE_MINUTES = 30;

// Middleware para la limitación de tasa por IP
const ipRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5, // Número máximo de peticiones permitidas
  handler: (req, res) => {
    return res.status(429).json({ message: 'Too many requests from this IP' });
  }
});

// Middleware para la limitación de tasa por ruta
const pathRateLimiter = (pathLimit) => {
  return rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: pathLimit, // Límite de peticiones por ruta
    handler: (req, res) => {
      return res.status(429).json({ message: 'This path has received too many requests' });
    }
  });
};

// Crear un token de acceso
function createAccessToken(data, expiresIn = `${ACCESS_TOKEN_EXPIRE_MINUTES}m`) {
  const payload = {
    ...data,
    exp: Math.floor(Date.now() / 1000) + (expiresIn * 60),
  };
  return jwt.sign(payload, SECRET_KEY, { algorithm: ALGORITHM });
}

// Verificar y obtener el usuario actual a partir del token
function getCurrentUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Could not validate credentials' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, { algorithms: [ALGORITHM] }, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Could not validate credentials' });
    }
    req.user = { username: decoded.sub };
    next();
  });
}

// Aplicar middlewares globales de rate limiting
app.use(ipRateLimiter);

// Ruta protegida con JWT
app.get('/protected', getCurrentUser, (req, res) => {
  res.json({ message: `Hello, ${req.user.username}!` });
});

// Ruta pública para obtener un token
app.post('/token', (req, res) => {
  const username = req.body.username;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  const token = createAccessToken({ sub: username });
  res.json({ token });
});

// Aplicar limitador por ruta
app.use('/api/some-path', pathRateLimiter(10));