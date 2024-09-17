const { exec } = require('child_process');
const path = require('path');

// Define los números que quieres pasar al script de Python
const start = 10;
const end = 50;

const scriptPath = path.join(__dirname, '../files/python/prueba.py');
// Construye el comando para ejecutar el script de Python con los argumentos
const command = `python ${scriptPath} ${start} ${end}`;

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error ejecutando el script: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`Error en el script: ${stderr}`);
        return;
    }
    console.log(`Número aleatorio entre ${start} y ${end}: ${stdout}`);
});