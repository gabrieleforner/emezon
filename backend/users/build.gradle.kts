plugins {
    id("java")
    id("application")
}

group = "emezon.users"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}
application {
    mainClass = "emezon.users.Main"
}
java {
    toolchain {
        toolchain.languageVersion.set(JavaLanguageVersion.of(17))
    }
}
dependencies {
    testImplementation(platform("org.junit:junit-bom:5.10.0"))
    testImplementation("org.junit.jupiter:junit-jupiter")
    testImplementation("org.mockito:mockito-core:5.20.0")
    testImplementation("org.mockito:mockito-inline:5.2.0")
    testImplementation("uk.org.webcompere:system-stubs-jupiter:2.1.8")  // Stubs for env vars setting


    implementation("org.apache.kafka:kafka-clients:4.1.0") // Kafka client for Java
    implementation("redis.clients:jedis:7.0.0") // Redis client for Java

    implementation("io.javalin:javalin:6.7.0")  // Javalin (HTTP server library)
    implementation("org.slf4j:slf4j-simple:2.0.16") //  Javalin logging API
}

tasks.test {
    useJUnitPlatform()
}