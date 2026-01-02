# --- STAGE 1: Build ---
FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# --- STAGE 2: Run ---
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the JAR from build stage
COPY --from=build /app/target/portfolio-springboot-1.0.0.jar app.jar

# Configuration
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
