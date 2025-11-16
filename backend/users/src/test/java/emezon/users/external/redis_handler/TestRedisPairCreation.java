package emezon.users.external.redis_handler;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import emezon.users.external.RedisHandler;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;


public class TestRedisPairCreation {
    @Mock
    RedisHandler mockRedisHandler = mock(RedisHandler.class);


    @Test
    @DisplayName("Pair creation fail (the key is null or empty)")
    void creationShouldFail_nullOrEmptyKey() {

    }

    @Test
    @DisplayName("Pair creation fail (value is null or empty)")
    void creationShouldFail_nullOrEmptyValue() {
        
    }

    @Test
    @DisplayName("Pair creation success (all parameters are valid)")
    void creationShouldSucceed_allParamsAreValid() {
    }
}
