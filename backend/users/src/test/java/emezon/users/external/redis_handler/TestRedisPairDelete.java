package emezon.users.external.redis_handler;

import emezon.users.external.RedisHandler;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import static org.mockito.Mockito.mock;

public class TestRedisPairDelete {
    @Mock
    RedisHandler mockRedisHandler = mock(RedisHandler.class);


    @Test
    @DisplayName("Pair deletion fail (the key is null or empty)")
    void deletionShouldFail_nullOrEmptyKey() {

    }

    @Test
    @DisplayName("Pair deletion fail (key not found)")
    void deletionShouldFail_keyNotFound() {

    }

    @Test
    @DisplayName("Pair deletion success (all parameters are valid)")
    void deletionShouldSucceed_allParamsAreValid() {
    }
}
