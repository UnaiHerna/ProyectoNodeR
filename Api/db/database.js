const mysql = require('mysql');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Cim12345!',
    database: 'datos'
});

// Conectar a la base de datos
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    } else {
        console.log('Connected to the database');
    }
});

// Manejar el cierre de la conexión cuando el proceso se interrumpe
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

module.exports = connection;