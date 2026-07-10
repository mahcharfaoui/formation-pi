FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY target/api-gateway-3.2.5.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:TieredStopAtLevel=1", "-XX:+UseSerialGC", "-Xmx384m", "-jar", "app.jar"]
