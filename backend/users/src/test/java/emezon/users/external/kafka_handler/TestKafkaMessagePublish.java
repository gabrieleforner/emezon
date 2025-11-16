package emezon.users.external.kafka_handler;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import emezon.users.external.KafkaHandler;
import org.apache.kafka.clients.producer.Callback;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import java.util.HashSet;
import java.util.Set;

class TestKafkaMessagePublish {
    @Mock
    KafkaProducer<String, String> mockProducer = mock(KafkaProducer.class); // KafkaProducer mocked
    KafkaHandler kafkaHandler;              // Kafka handler
    Set<String> mockAvailableTopics = new HashSet<>();        // Mock list of available topics

    @Test
    @DisplayName("Publish fail (null or empty)")
    void publishFail_topicNullOrEmpty() {
        mockAvailableTopics.add("test_topic");
        mockAvailableTopics.add("test_topic2");
        mockAvailableTopics.add("test_topic3");

        kafkaHandler = new KafkaHandler(mockProducer, mockAvailableTopics);

        assertThrows(IllegalArgumentException.class, () -> {
            kafkaHandler.publishEvent(null, "test_key", "test_value");
        });
        verify(mockProducer, times(0)).send(any());

        assertThrows(IllegalArgumentException.class, () -> {
            kafkaHandler.publishEvent("", "test_key", "test_value");
        });
        verify(mockProducer, times(0)).send(any());
    }

    @Test
    @DisplayName("Publish fail (topic not found)")
    void publishFail_topicNotFound() {
        mockAvailableTopics.add("test_topic");
        mockAvailableTopics.add("test_topic2");
        mockAvailableTopics.add("test_topic3");

        kafkaHandler = new KafkaHandler(mockProducer, mockAvailableTopics);

        assertThrows(IllegalArgumentException.class, () -> {
            kafkaHandler.publishEvent("nonexistent-topic", "test_key", "test_value");
        });
        verify(mockProducer, times(0)).send(any());
    }

    @Test
    @DisplayName("Publish success, all parameters are valid")
    void publishSuccess_allValid() {
        mockAvailableTopics.add("test_topic");
        mockAvailableTopics.add("test_topic2");
        mockAvailableTopics.add("test_topic3");
        kafkaHandler = new KafkaHandler(mockProducer, mockAvailableTopics);

        ProducerRecord<String, String> expectedProducerRecord = new ProducerRecord<>("test_topic",
                "test_key",
                "test_value"
        );
        kafkaHandler.publishEvent("test_topic", "test_key", "test_value");

        // Check if KafkaProducer is invoked with right args
        verify(mockProducer, times(1)).send(
                argThat(record ->
                        expectedProducerRecord.topic().equals(record.topic()) &&
                        expectedProducerRecord.key().equals(record.key()) &&
                        expectedProducerRecord.value().equals(record.value())
                ),
                any(Callback.class)
        );
    }
}