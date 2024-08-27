const { exec } = require('child_process');
const path = require('path');

function r(a, b) {
    const scriptPath = path.join(__dirname, '../RPython/suma.R');

    // Construye el comando con los argumentos
    const command = `Rscript ${scriptPath} ${a} ${b}`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
            } else if (stderr) {
                reject(`Stderr: ${stderr}`);
            } else {
                resolve(stdout.trim()); // Elimina espacios en blanco y saltos de línea
            }
        });
    });
}

module.exports = r;