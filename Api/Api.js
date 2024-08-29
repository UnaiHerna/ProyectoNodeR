const express = require('express');
const mysql = require('mysql');
const executeRScript = require('./func/executeRScript');
const { readDatosSensorByVariable } = require('./func/sensorvacio'); // Asegúrate de que la ruta sea correcta para importar la función

const app = express();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Cim12345!',
    database: 'datos'
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

app.get('/heatmap', (req, res) => {
    connection.query('SELECT * FROM heatmap_sergio', (err, rows, fields) => {
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

// Nueva ruta para /datos/sensorvacio/
app.get('/datos/sensorvacio', async (req, res) => {
    const { variable, equipo, start_date, end_date, tipo } = req.query;

    // Verificar que los parámetros requeridos estén presentes
    if (!variable || !equipo || !start_date || !end_date) {
        return res.status(400).send('Faltan parámetros requeridos');
    }

    try {
        // Llama a la función para leer los datos con los parámetros proporcionados
        const data = await readDatosSensorByVariable(variable, equipo, start_date, end_date, tipo);
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al obtener los datos del sensor:', error.message);
        res.status(500).send('Error al obtener los datos del sensor.');
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
