FROM openjdk:21-jdk-slim

WORKDIR /app

COPY ./backend/build.gradle ./backend/settings.gradle ./backend/gradlew ./
COPY ./backend/gradle ./gradle

COPY ./backend/ ./

RUN chmod +x ./gradlew

CMD ["./gradlew", "bootRun", "--no-daemon"]