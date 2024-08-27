const express = require('express');
const mysql = require('mysql');
// const path = require('path'); // Se necesita para manejar rutas correctamente

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Cim12345!',
    database : 'datos'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    } else {
        console.log('Connected to the database');
    }
});

const app = express();
const desiredPort = process.env.PORT ?? 1234;

// Ajusta la ruta para servir los archivos estáticos
// const webPath = path.join(__dirname, 'web');

// Sirve todos los archivos estáticos dentro de la carpeta 'web'
// app.use('/web', express.static(webPath));

// app.get('/web/*', (req, res) => {
    // res.sendFile(path.join(webPath, 'index.html')); // Sirve el index.html de React
// });

app.get('/', (req, res) => {
    connection.query('SELECT * FROM variable', (err, rows, fields) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Internal server error');
        } else {
            res.status(200).json(rows);
        }
    });
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