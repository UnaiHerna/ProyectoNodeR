module.exports = {
    development: {
        client: 'mysql',  // Asegúrate de que el cliente esté especificado
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'Cim12345!',
            database: 'datos'
        }
    },
    // Puedes agregar más configuraciones para otros entornos (production, test, etc.)
};