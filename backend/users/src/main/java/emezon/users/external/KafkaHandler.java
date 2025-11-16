package emezon.users.external;

import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Properties;
import java.util.Set;

/**
 * This class is used for initialize and abstract Kafka client.
 * @author Gabriele Forner (gabriele.forner@icloud.com)
 * @since 1.0
 */
public class KafkaHandler {
    KafkaProducer<String, String> kafkaProducer;
    Set<String> availableTopics;

    /**
     * Create a {@see Properties} for configuring a connection to Kafka
     * @author Gabriele Forner
     * @throws RuntimeException if there are errors while getting the Kafka configuration {@see getKafkaConfigProperties}
     * @return an instance of Properties {@see Properties} containing the Kafka connection settings
     */
    @NotNull
    public static Properties getKafkaConfigProperties() throws RuntimeException {
        Logger logger = LoggerFactory.getILoggerFactory().getLogger(KafkaHandler.class.toString());
        try {
            String bsServerHost = System.getenv("KAFKA_BROKER_HOST");
            String bsServerPort = System.getenv("KAFKA_BROKER_PORT");

            // Validation of hostname
            if(bsServerHost == null) throw new Exception("KAFKA_BROKER_HOST environment variable is not set");
            if (bsServerHost.isEmpty()) throw new Exception("KAFKA_BROKER_HOST environment variable is empty");

            // Validation of port
            if(bsServerPort == null) throw new Exception("KAFKA_BROKER_PORT environment variable is not set");
            if (bsServerPort.isEmpty()) throw new Exception("KAFKA_BROKER_PORT environment variable is empty");
            int serverPort = Integer.parseInt(bsServerPort);

            logger.info("KAFKA_BROKER_HOST: {}", bsServerHost);
            logger.info("KAFKA_BROKER_PORT: {}", serverPort);

            Properties kafkaSetupProperties = new Properties();

            // Server and communication config
            kafkaSetupProperties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bsServerHost +":"+ bsServerPort);
            kafkaSetupProperties.put(ProducerConfig.ACKS_CONFIG, "all");
            kafkaSetupProperties.put(ProducerConfig.RETRIES_CONFIG, 3);

            // Serializers for key and value
            kafkaSetupProperties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
            kafkaSetupProperties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
            return kafkaSetupProperties;
        } catch(Exception e) {
            logger.error("Failed to retrieve Kafka configuration: {}", e.getMessage());
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
    public KafkaHandler() throws RuntimeException {
        try {
            AdminClient adminClient = AdminClient.create(getKafkaConfigProperties());
            this.availableTopics = adminClient.listTopics().names().get();
            this.kafkaProducer = new KafkaProducer<>(getKafkaConfigProperties());
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
     * Initialize a mock connection to Kafka. It is intended to be used for unit testing
     * @author Gabriele Forner
     * @param kafkaProducer mock instance of a KafkaProducer{@see KafkaProducer}
     * @param availableTopics mock list of Kafka topics
     */
    public KafkaHandler(KafkaProducer<String, String> kafkaProducer, Set<String> availableTopics) {
        this.kafkaProducer = kafkaProducer;
        this.availableTopics = availableTopics;
    }

    /**
     * Publish a message in a specific topic.
     * @author Gabriele Forner
     * @param topic name of the topic where the message will be published to
     * @param key string representing the key of the message
     * @param value the string (or object but string-formatted) related to the message
     */
    public void publishEvent(String topic, String key, String value) throws IllegalArgumentException {
        // Validate whether topic is valid and exists
        if(topic == null || topic.isEmpty()) throw new IllegalArgumentException("topic cannot be empty");
        if(!this.availableTopics.contains(topic)) throw new IllegalArgumentException("topic does not exist");
        Logger logger = LoggerFactory.getILoggerFactory().getLogger(KafkaHandler.class.toString());

        // Build the record and send asynchronously to Kafka
        ProducerRecord<String, String> record = new ProducerRecord<>(topic, key, value);
        kafkaProducer.send(record, (metadata, exception) -> {
            if (exception == null) {
                logger.info("Message produced to topic {} partition {} offset {}",
                        metadata.topic(), metadata.partition(), metadata.offset());
            } else {
                logger.error("Failed to send message to topic {}", topic, exception);
            }
        });
        kafkaProducer.flush();
    }
}