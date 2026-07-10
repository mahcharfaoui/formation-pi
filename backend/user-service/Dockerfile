FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/user-service-3.2.5.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/app.jar"]
