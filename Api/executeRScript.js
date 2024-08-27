const { exec } = require('child_process');

function executeRScript() {
    return new Promise((resolve, reject) => {
        exec('Rscript path/to/tu_script.R', (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
            } else if (stderr) {
                reject(`Stderr: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
}

module.exports = executeRScript;