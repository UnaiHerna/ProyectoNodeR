const redis = require('redis');
const { promisify } = require('util');

// Cliente de Redis
class RedisClient {
    constructor(host = 'localhost', port = 6379, db = 0) {
        this.client = redis.createClient({
            host: host,
            port: port,
            db: db
        });

        // Promisify Redis commands
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setexAsync = promisify(this.client.setex).bind(this.client);
    }

    getClient() {
        return this.client;
    }

    async getAsyncWrapper(key) {
        return await this.getAsync(key);
    }

    async setexAsyncWrapper(key, expiration, data) {
        return await this.setexAsync(key, expiration, data);
    }
}

// Inicializa el cliente de Redis
const redisClient = new RedisClient();

// Serializador de JSON
function jsonSerializer(obj) {
    if (obj instanceof Date) {
        return obj.toISOString();
    }
    throw new TypeError(`Type ${typeof obj} not serializable`);
}

// Deserializador de JSON
function jsonDeserializer(key, value) {
    if (typeof value === 'string' && value.length === 24) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    return value;
}

// Obtener respuesta cacheada
async function getCachedResponse(key) {
    const cachedData = await redisClient.getAsyncWrapper(key);
    if (cachedData) {
        console.log(`Data retrieved from Redis for key: ${key}`); // Aviso en consola
        return JSON.parse(cachedData, jsonDeserializer);
    }
    return null;
}

// Guardar respuesta en cache
async function setCachedResponse(key, data, expiration = 30) {
    console.log(`Data sent to Redis for key: ${key}`); // Aviso en consola
    await redisClient.setexAsyncWrapper(key, expiration, JSON.stringify(data, jsonSerializer));
}

module.exports = { getCachedResponse, setCachedResponse };