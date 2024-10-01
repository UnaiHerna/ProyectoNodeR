const bcrypt = require('bcrypt');
const saltRounds = 10; // Puedes ajustar el número de saltos

async function generarHashContraseña(plainPassword) {
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        console.log("Contraseña hasheada:", hashedPassword);
        return hashedPassword;
    } catch (error) {
        console.error('Error generando el hash:', error);
        throw error;
    }
}

const password = 'efiri';
generarHashContraseña(password);
