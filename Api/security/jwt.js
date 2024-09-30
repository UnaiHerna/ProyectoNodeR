const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db/database');

const router = express.Router();

const secret = "f99bf1e250d2e6f3328bdfa25bfad89a72a113dba905d94b8081fbc4d5aa6918";
const algorithm = "HS256";
const accessTokenExpireMinutes = 1;

async function searchUserdb(username) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
            if (err) reject(err);
            if (results.length > 0) resolve(results[0]);
            else resolve(null);
        });
    });
}

async function searchUser(username) {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM user WHERE username = ?', [username], (err, results) => {
            if (err) reject(err);
            if (results.length > 0) resolve(results[0]);
            else resolve(null);
        });
    });
}

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await searchUserdb(username);
        if (!user) {
            return res.status(400).json({ detail: "El usuario no es correcto" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ detail: "Contraseña incorrecta" });
        }

        const accessToken = {
            sub: user.username,
            exp: Math.floor(Date.now() / 1000) + accessTokenExpireMinutes * 60,
        };

        const token = jwt.sign(accessToken, secret, { algorithm });

        res.json({
            access_token: token,
            token_type: "bearer",
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ detail: "Error interno del servidor" });
    }
});

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ detail: 'No has iniciado sesión o tu sesión ha expirado' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, secret, { algorithms: [algorithm] }, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ detail: 'No has iniciado sesión o tu sesión ha expirado' });
        }

        const user = await searchUser(decoded.sub);
        if (!user) {
            return res.status(401).json({ detail: 'Usuario no encontrado' });
        }

        req.user = user;
        next();
    });
};

router.get('/users/me', authenticateUser, (req, res) => {
    res.json(req.user);
});

module.exports = router;
