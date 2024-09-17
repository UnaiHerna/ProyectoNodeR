const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function compileJava() {
    const javaFile = path.join(__dirname, '../files/java/h2o_ai/src/app/Main.java'); // Ruta del archivo Java
    const outputPath = path.join(__dirname, '../files/java/build'); // Directorio donde guardarás el .class
    const libPath = path.join(__dirname, '../files/java/h2o_ai/src/files/h2o-genmodel.jar'); // Directorio que contiene los JAR

    console.log('Compilando archivo:', javaFile);
    console.log('Directorio de salida:', outputPath);
    console.log('Directorio de librerías:', libPath);

    // Verificar si el archivo Java existe
    if (!fs.existsSync(javaFile)) {
        console.error(`El archivo ${javaFile} no existe.`);
        return;
    }

    // Comando de compilación incluyendo el classpath
    const command = `javac -cp ${libPath}/ -d ${outputPath} ${javaFile}`;

    console.log(command);

    try {
        const stdout = execSync(command, { encoding: 'utf-8' }); // Usa encoding para obtener una cadena de texto
        console.log('Compilación exitosa:', stdout);
    } catch (error) {
        console.error('Error en execSync:', error.message); // Muestra el mensaje de error
        console.error('Stderr:', error.stderr.toString()); // Muestra el stderr
    }
}

compileJava();

module.exports = compileJava;