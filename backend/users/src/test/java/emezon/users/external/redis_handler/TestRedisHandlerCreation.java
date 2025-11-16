package emezon.users.external.redis_handler;

import emezon.users.external.RedisHandler;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import uk.org.webcompere.systemstubs.environment.EnvironmentVariables;
import uk.org.webcompere.systemstubs.jupiter.SystemStub;
import uk.org.webcompere.systemstubs.jupiter.SystemStubsExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SystemStubsExtension.class)
public class TestRedisHandlerCreation {
    @SystemStub
    private EnvironmentVariables testEnvVars  = new EnvironmentVariables();

    @Mock
    RedisHandler mockRedisHandler = mock(RedisHandler.class);
    @BeforeEach
    void setupEnvVars() {
        testEnvVars.set("REDIS_HOST", "localhost");
        testEnvVars.set("REDIS_PORT", "9092");
    }

    @AfterEach
    void clearEnvVars() {
        testEnvVars.set("REDIS_HOST", "");
        testEnvVars.set("REDIS_PORT", "");
    }

    @Test
    @DisplayName("getRedisConfigProperties should work fine")
    void configValidationShouldSucceed_envVarsAreValid() {
        testEnvVars.set("REDIS_HOST", "generichost");
        testEnvVars.set("REDIS_PORT", "6379");

        assertDoesNotThrow(()->{
            RedisHandler.getRedisConfigProperties();
        });
    }

    @Test
    @DisplayName("getRedisConfigProperties throws due to empty, invalid or null port")
    void configValidationShouldThrow_nullOrEmptyOrInvalidPort() {
        testEnvVars.set("REDIS_HOST", "generichost");

        // With NULL port
        testEnvVars.set("REDIS_PORT", null);
        assertThrows(RuntimeException.class, RedisHandler::getRedisConfigProperties);

        // With empty port
        testEnvVars.set("REDIS_PORT", "");
        assertThrows(RuntimeException.class, RedisHandler::getRedisConfigProperties);

        // With invalid port
        testEnvVars.set("port", "132re@edf");
        assertThrows(RuntimeException.class, RedisHandler::getRedisConfigProperties);
    }
    
    @Test
    @DisplayName("getRedisConfigProperties throws due to empty or null host")
    void configValidationShouldThrow_nullOrInvalidHost() {
        // With NULL port
        testEnvVars.set("REDIS_HOST", null);
        assertThrows(RuntimeException.class, RedisHandler::getRedisConfigProperties);

        // With empty host
        testEnvVars.set("REDIS_HOST", "");
        assertThrows(RuntimeException.class, RedisHandler::getRedisConfigProperties);
    }
}
