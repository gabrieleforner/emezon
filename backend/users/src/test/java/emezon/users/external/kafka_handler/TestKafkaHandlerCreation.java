package emezon.users.external.kafka_handler;

import emezon.users.external.KafkaHandler;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import uk.org.webcompere.systemstubs.environment.EnvironmentVariables;
import uk.org.webcompere.systemstubs.jupiter.SystemStub;
import uk.org.webcompere.systemstubs.jupiter.SystemStubsExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SystemStubsExtension.class)
public class TestKafkaHandlerCreation {
    @SystemStub
    private EnvironmentVariables testEnvVars  = new EnvironmentVariables();

    @BeforeEach
    void setupEnvVars() {
        testEnvVars.set("KAFKA_BROKER_HOST", "localhost");
        testEnvVars.set("KAFKA_BROKER_PORT", "9092");
    }

    @AfterEach
    void clearEnvVars() {
        testEnvVars.set("KAFKA_BROKER_HOST", "");
        testEnvVars.set("KAFKA_BROKER_PORT", "");
    }

    @Test
    @DisplayName("getKafkaConfigProperties should work fine")
    void constructorShouldSucceed_envVarsAreValid() {
        testEnvVars.set("KAFKA_BROKER_HOST", "localhost");
        testEnvVars.set("KAFKA_BROKER_PORT", "9092");
        assertDoesNotThrow(KafkaHandler::getKafkaConfigProperties);
    }

    @Test
    @DisplayName("getKafkaConfigProperties throws due to empty or null host")
    void constructorShouldThrow_whenHostIsMissing() {
        testEnvVars.set("KAFKA_BROKER_HOST", "");
        assertThrows(RuntimeException.class, KafkaHandler::getKafkaConfigProperties);

        testEnvVars.set("KAFKA_BROKER_HOST", null);
        assertThrows(RuntimeException.class, KafkaHandler::getKafkaConfigProperties);
    }

    @Test
    @DisplayName("getKafkaConfigProperties throws due to empty or null port")
    void constructorShouldThrow_whenPortIsEmpty() {
        testEnvVars.set("KAFKA_BROKER_PORT", "");
        assertThrows(RuntimeException.class, KafkaHandler::getKafkaConfigProperties);

        testEnvVars.set("KAFKA_BROKER_PORT", null);
        assertThrows(RuntimeException.class, KafkaHandler::getKafkaConfigProperties);
    }

    @Test
    @DisplayName("getKafkaConfigProperties throws due to invalid port")
    void constructorShouldThrow_whenPortIsInvalid() {
        testEnvVars.set("KAFKA_BROKER_PORT", "1nval1dp0rt");
        assertThrows(RuntimeException.class, KafkaHandler::getKafkaConfigProperties);
    }
}