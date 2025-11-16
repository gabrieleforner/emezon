package emezon.users.external.redis_handler;

import emezon.users.external.RedisHandler;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import static org.mockito.Mockito.mock;

public class TestRedisPairEdit {
    @Mock
    RedisHandler mockRedisHandler = mock(RedisHandler.class);


    @Test
    @DisplayName("Pair editing fail (the key is null or empty)")
    void editShouldFail_nullOrEmptyKey() {

    }

    @Test
    @DisplayName("Pair editing fail (key not found)")
    void editShouldFail_keyNotFound() {

    }

    @Test
    @DisplayName("Pair editing success (all parameters are valid)")
    void editShouldSucceed_allParamsAreValid() {

    }
}
