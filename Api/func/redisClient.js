// Api/func/redisClient.js
const redis = require('redis');

class RedisClient {
    constructor(host = 'localhost', port = 6379, db = 0) {
        this.client = redis.createClient({
            url: `redis://${host}:${port}/${db}`
        });

        this.client.on('error', (err) => {
            console.error('Error connecting to Redis:', err);
        });

        this.client.connect().catch(err => {
            console.error('Error connecting to Redis:', err);
        });
    }

    async getCachedResponse(key) {
        try {
            const cachedData = await this.client.get(key);
            if (cachedData) {
                console.log(`Data retrieved from Redis for key: ${key}`);
                return JSON.parse(cachedData);
            }
            return null;
        } catch (err) {
            console.error('Error getting data from Redis:', err);
            return null;
        }
    }

    async setCachedResponse(key, data, expiration = 30) {
        try {
            console.log(`Data sent to Redis for key: ${key}`);
            await this.client.setEx(key, expiration, JSON.stringify(data));
        } catch (err) {
            console.error('Error setting data to Redis:', err);
        }
    }

    close() {
        return this.client.quit(); // Asegúrate de cerrar la conexión correctamente
    }
}

// Exporta una instancia del cliente de Redis
const redisClient = new RedisClient();
module.exports = redisClient;