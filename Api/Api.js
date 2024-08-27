const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); // Importa el middleware CORS
const executeRScript = require('./executeRScript');

const app = express();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Cim12345!',
    database: 'sergio'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    } else {
        console.log('Connected to the database');
    }
});

const desiredPort = process.env.PORT ?? 1234;

// Configura CORS para permitir solicitudes desde cualquier origen
app.use(cors({
    origin: '*', // Permite todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
}));

// Si necesitas servir archivos estáticos, descomenta y ajusta esto
// const path = require('path');
// const webPath = path.join(__dirname, 'web');
// app.use('/web', express.static(webPath));
// app.get('/web/*', (req, res) => {
//     res.sendFile(path.join(webPath, 'index.html')); // Sirve el index.html de React
// });

app.get('/heatmap', (req, res) => {
    connection.query('SELECT * FROM heatmap', (err, rows) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json(rows);
        }
    });
});

app.get('/r', async (req, res) => {
    try {
        const result = await executeRScript(3000.0, 3.0, 52300.0, 10.0, 20.0);
        res.status(200).send(result);
    } catch (error) {
        console.error('Error executing R script:', error);
        res.status(500).send('Internal server error');
    }
});

app.listen(desiredPort, () => {
    console.log(`Server listening on port http://localhost:${desiredPort}`);
});

process.on('SIGINT', () => {
    connection.end(err => {
        if (err) {
            console.error('Error closing the database connection:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
