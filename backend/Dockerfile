FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
RUN apk add --no-cache maven

COPY pom.xml ./
COPY backend/eureka-server/pom.xml backend/eureka-server/
COPY backend/api-gateway/pom.xml backend/api-gateway/
COPY backend/catalogue-service/pom.xml backend/catalogue-service/
COPY backend/user-service/pom.xml backend/user-service/
COPY backend/formateur-service/pom.xml backend/formateur-service/
COPY backend/session-service/pom.xml backend/session-service/
COPY backend/quiz-service/pom.xml backend/quiz-service/
COPY backend/suivi-service/pom.xml backend/suivi-service/
COPY backend/certification-service/pom.xml backend/certification-service/
COPY backend/ml-service/pom.xml backend/ml-service/

RUN mvn dependency:go-offline -B || true

COPY backend/ backend/
RUN mvn clean package -DskipTests -B -pl backend/${SERVICE_NAME} -am

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/${SERVICE_NAME}/target/*.jar app.jar
EXPOSE ${PORT}
ENTRYPOINT ["java", "-jar", "app.jar"]
