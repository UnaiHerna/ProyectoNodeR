const { exec } = require('child_process');
const path = require('path');

function executePython(num1, num2) {
    return new Promise((resolve, reject) => {
        const start = num1;
        const end = num2;

        const scriptPath = path.join(__dirname, '../files/python/prueba.py');
        const command = `python ${scriptPath} ${start} ${end}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(`Error ejecutando el script: ${error}`);
            }
            if (stderr) {
                return reject(`Error en el script: ${stderr}`);
            }

            // Devuelve el resultado en un objeto
            resolve({ num: stdout.trim() });
        });
    });
}

module.exports = executePython;