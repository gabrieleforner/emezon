package emezon.users.external;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.time.Duration;

/**
 * This class is used for initialize and abstract Redis client.
 * @author Gabriele Forner (gabriele.forner@icloud.com)
 * @since 1.0
 */
public class RedisHandler {
    JedisPool redisConnectionPool = null;

    public static class RedisConfiguration {
        public String host; ///<Host or IP of the Redis server
        public int port;    ///<Port used by the server for Redis traffic
        /**
         * Mostly useless, is used only for instantiate the object
         * @author Gabriele Forner (gabriele.forner@icloud.com)
         */
        public RedisConfiguration() {
            this.port = -1;
            this.host = null;
        }
    }
    /**
     * Create a {@see Properties} for configuring a connection to Redis
     * @author Gabriele Forner
     * @throws RuntimeException if there are errors while getting the Redis configuration {@see getRedisConfigProperties}
     * @return an instance of Properties {@see RedisConfiguration} containing the Redis connection settings
     */
    @NotNull
    public static RedisConfiguration getRedisConfigProperties() throws RuntimeException {
        Logger logger = LoggerFactory.getILoggerFactory().getLogger(RedisHandler.class.toString());
        try {
            String bsServerHost = System.getenv("REDIS_HOST");
            String bsServerPort = System.getenv("REDIS_PORT");

            // Validation of hostname
            if(bsServerHost == null) throw new Exception("REDIS_HOST environment variable is not set");
            if (bsServerHost.isEmpty()) throw new Exception("REDIS_HOST environment variable is empty");

            // Validation of port
            if(bsServerPort == null) throw new Exception("REDIS_PORT environment variable is not set");
            if (bsServerPort.isEmpty()) throw new Exception("REDIS_PORT environment variable is empty");

            int serverPort = -1;
            try {
                serverPort = Integer.parseInt(bsServerPort);
            } catch (NumberFormatException e) {
                throw new Exception("REDIS_PORT environment variable is not an integer");
            }

            RedisConfiguration redisConfigProperties = new RedisConfiguration();

            // Server and communication config
            redisConfigProperties.host = bsServerHost;
            redisConfigProperties.port = serverPort;

            return redisConfigProperties;
        } catch(Exception e) {
            logger.error("Failed to retrieve Redis configuration: {}", e.getMessage());
            RuntimeException replyException = new RuntimeException(e.getMessage());
            replyException.initCause(e.getCause());
            replyException.setStackTrace(e.getStackTrace());
            throw replyException;
        }
    }

    /**
     * Initialize a connection to Kafka. It is not intended to be used for unit testing
     * @author Gabriele Forner
     * @throws RuntimeException if:
     *      <ul>
     *          <li>There are errors while getting the Kafka configuration {@see getKafkaConfigProperties}</li>
     *          <li>THere are errors while connecting to Kafka</li>
     *      </ul>
     */
    public RedisHandler() throws RuntimeException {
        try {
            JedisPoolConfig poolConfig = new JedisPoolConfig();

            poolConfig.setMaxIdle(50); // At maximum 50 connections in idle
            poolConfig.setMinIdle(10); // At minimum 10 connections always ready
            poolConfig.setMaxTotal(100);
            poolConfig.setMaxWait(Duration.ofMillis(1000));

            RedisConfiguration redisConfigProperties = getRedisConfigProperties();
            this.redisConnectionPool = new JedisPool(poolConfig,
                    redisConfigProperties.host,
                    redisConfigProperties.port
            );
        }
        catch(Exception e) {
            // Notify the error
            Logger logger = LoggerFactory.getILoggerFactory().getLogger(KafkaHandler.class.toString());
            logger.error("Failed to setup connection to Kafka:");

            // Reply the exception at function caller
            RuntimeException replyException = new RuntimeException(e.getMessage());
            replyException.initCause(e.getCause());
            replyException.setStackTrace(e.getStackTrace());
            throw replyException;
        }
    }

    /**
     * Initialize a mock connection to Redis. It is intended to be used for unit testing
     * @author Gabriele Forner
     * @param connectionPool instance of a JedisPool {@see JedisPool}
     */
    public RedisHandler(JedisPool connectionPool) {
        this.redisConnectionPool = connectionPool;
    }

    /**
     * Create a new key-value pair, eventually with a Time-To-Live
     * @author Gabriele Forner
     * @param key key of the pair
     * @param value value of the pair
     * @param TTLms the TTL of the pair in milliseconds
     *
     * @throws RuntimeException if there are errors while communicating with Redis
     * @throws IllegalArgumentException if the parameters are invalid
     */
    public void setValue(String key, byte[] value, long TTLms) throws RuntimeException, IllegalArgumentException {
        try {
            if (key == null) throw new IllegalArgumentException("key cannot be null");
            if (key.length() == 0) throw new IllegalArgumentException("key length cannot be 0");

            if (TTLms < 0) throw new IllegalArgumentException("key-value pair TTL cannot be negative");
            else if (TTLms == 0) {
                // Create a new key-value pair without TTL
                String result = this.redisConnectionPool.getResource().set(key.getBytes(), value);
                if (!result.equals("OK")) {
                    throw new RuntimeException("Failed to set Redis value for key: " + key);
                }
            } else {
                // Create a new key-value pair with TTL
                String result = this.redisConnectionPool.getResource().setex(key.getBytes(), TTLms / 1000, value);
                if (!result.equals("OK")) {
                    throw new RuntimeException("Failed to set Redis value for key: " + key);
                }
            }
        }
        catch(Exception e){
            if(e instanceof IllegalArgumentException){
                RuntimeException replyException = new RuntimeException(e.getMessage());
            }
            throw e;
        }
    }

    /**
     * Read an existing value
     * @author Gabriele Forner
     * @param key string representing the key of the pair
     *
     * @throws IllegalArgumentException if the parameters are invalid
     * @returns data bytes representing the value of the pair
     */
    public byte[] getValue(byte[] key) throws IllegalArgumentException {
        if (key == null) throw new IllegalArgumentException("key cannot be null");
        byte[] value = this.redisConnectionPool.getResource().get(key);
        return value;
    }
    /**
     * Edit an existing value
     * @author Gabriele Forner
     * @param newValue new value to bind to the existing key
     * @param key string representing the key of the message
     *
     * @throws RuntimeException if there are errors while communicating with Redis
     * @throws IllegalArgumentException if the parameters are invalid
     */
    public void editValue(String key, byte[] newValue) throws RuntimeException, IllegalArgumentException {
        this.setValue(key, newValue, 0);
    }

    /**
     * Delete a key-value pair
     * @author Gabriele Forner
     * @param key string representing the key of the message
     *
     * @throws RuntimeException if there are errors while communicating with Redis
     * @throws IllegalArgumentException if the parameters are invalid
     */
    public void deleteValue(byte[] key) throws IllegalArgumentException {
        if (key == null) throw new IllegalArgumentException("key cannot be null");
        if (key.length == 0) throw new IllegalArgumentException("key length cannot be 0");

        this.redisConnectionPool
                .getResource()
                .del(key);
    }
}