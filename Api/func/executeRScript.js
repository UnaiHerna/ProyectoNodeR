const { exec } = require('child_process');
const path = require('path');

function executeRScript(mltss_sp, so_aer_sp, q_int, tss_eff_sp, temp) {
    const scriptPath = path.join(__dirname, '../f_steady_state_wwtp.R');

    // Construye el comando con los argumentos
    const command = `Rscript ${scriptPath} ${mltss_sp} ${so_aer_sp} ${q_int} ${tss_eff_sp} ${temp}`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
            } else if (stderr) {
                reject(`Stderr: ${stderr}`);
            } else {
                console.log(`${stdout}`);
                resolve(stdout);
            }
        });
    });
}

module.exports = executeRScript;
