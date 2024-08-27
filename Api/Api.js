const express = require('express');
const mysql = require('mysql');
const executeRScript = require('./executeRScript');
// const r = require('./r');
// const path = require('path'); // Se necesita para manejar rutas correctamente

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Cim12345!',
    database : 'sergio'
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


app.get('/heatmap', (req, res) => {
    connection.query('SELECT * FROM heatmap', (err, rows, fields) => {
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

app.get('/r', async (req, res) => {
    try {
        const result = await executeRScript(3000.0, 3.0, 52300.0, 10.0, 20.0);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
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