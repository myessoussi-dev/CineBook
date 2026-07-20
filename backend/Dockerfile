FROM  maven:3.9.15-eclipse-temurin-21-alpine AS build
WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests


FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
#this for the first launch
#ENTRYPOINT ["java", "-jar", "app.jar","--init-all"]
#then use this down below:
ENTRYPOINT ["java", "-jar", "app.jar"]
CMD [ "--init-now-playing" ]