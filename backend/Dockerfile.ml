FROM eclipse-temurin:17-jdk-alpine AS build

WORKDIR /app

COPY backend/pom.xml ./backend/
COPY backend/ml-service/pom.xml ./backend/ml-service/

RUN cd backend && mvn dependency:go-offline -pl ml-service

COPY backend/ml-service/src ./backend/ml-service/src

RUN cd backend && mvn clean package -pl ml-service -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/backend/ml-service/target/*.jar app.jar

EXPOSE 8088

ENTRYPOINT ["java", "-jar", "app.jar"]
