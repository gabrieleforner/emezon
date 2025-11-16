package emezon.users.external.redis_handler;

import emezon.users.external.RedisHandler;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import static org.mockito.Mockito.mock;

public class TestRedisPairRead {
    @Mock
    RedisHandler mockRedisHandler = mock(RedisHandler.class);


    @Test
    @DisplayName("Pair read fail (the key is null or empty)")
    void readShouldFail_nullOrEmptyKey() {

    }

    @Test
    @DisplayName("Pair read fail (key not found)")
    void readShouldFail_keyNotFound() {

    }

    @Test
    @DisplayName("Pair read success (all parameters are valid)")
    void readShouldSucceed_allParamsAreValid() {
    }
}
