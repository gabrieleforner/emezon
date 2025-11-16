package emezon.users;

import emezon.users.external.KafkaHandler;
import emezon.users.external.RedisHandler;
import io.javalin.Javalin;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {
    // Utility record to store HTTP server configuration
    private record HTTPServerConfig(String httpServerHostname, int httpServerPort) { }

    public static void main(String[] args) {
        try {
            // Retrieve and validate HTTP server configuration
            HTTPServerConfig httpServerConfig = getHTTPServerConfig();

            Javalin.create(config -> {
                /* Set up API routes */
                config.router.apiBuilder(()-> {  });

                /* Manage external services relying on server events */
                config.events.serverStarted(() -> { // Initialize the services
                    KafkaHandler kafkaHandler = new KafkaHandler();
                    RedisHandler redisHandler = new RedisHandler();
                });
                config.events.serverStopped(() -> { });     // Release all the connections
            }).start(
                    httpServerConfig.httpServerHostname(),
                    httpServerConfig.httpServerPort()
            );
        }
        catch(RuntimeException e) {
            Logger logger = LoggerFactory.getILoggerFactory().getLogger(KafkaHandler.class.toString());
            logger.error("Failed to initialize application!");
            logger.error("Message: {}", e.getMessage());
            logger.error("Stacktrace: {}", (Object) e.getStackTrace());
        }
    }

    @NotNull
    private static HTTPServerConfig getHTTPServerConfig() {
        String httpServerHostname = System.getenv("HTTP_SERVER_HOSTNAME");
        String _httpServerPort = System.getenv("HTTP_SERVER_PORT");

        if(httpServerHostname == null) throw new RuntimeException("HTTP_SERVER_HOSTNAME environment variable is not set");
        if (_httpServerPort.isEmpty()) throw new RuntimeException("HTTP_SERVER_PORT environment variable is empty");

        int httpServerPort = Integer.parseInt(_httpServerPort);
        return new HTTPServerConfig(httpServerHostname, httpServerPort);
    }
}