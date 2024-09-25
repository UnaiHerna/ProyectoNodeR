const { exec } = require('child_process');
const path = require('path');

function executeJava(age, race, psa, gleason) {
    // Ruta al directorio donde están los archivos .class
    const classPath = `${path.join(__dirname, '../files/java/build')};${path.join(__dirname, '../files/java/h2o_ai/src/files/h2o-genmodel.jar')}`; // Incluye el JAR de dependencias
    //const classPath = `${path.join(__dirname, '../files/java/build')}:${path.join(__dirname, '../files/java/h2o_ai/src/files/h2o-genmodel.jar')}`;
    const javaFile = 'app.Main'; // Nombre completo de la clase que contiene el método main (sin extensión .class)

    const command = `java -cp "${classPath}" ${javaFile} ${age} ${race} ${psa} ${gleason}`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Error en exec:', error);
                return reject(`Error ejecutando Java: ${error.message || error}`);
            }
            if (stderr) {
                console.warn('Stderr en exec:', stderr);
                return reject(`Stderr ejecutando Java: ${stderr}`);
            }
            resolve(stdout);
        });
    });
}

module.exports = executeJava;
