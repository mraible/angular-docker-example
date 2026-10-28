# Angular Docker Example

A note-taking app with an Angular front end (`notes`) and a Kotlin + Spring Boot API (`notes-api`), secured with Auth0. It's the example app for the Docker chapter of the [Angular Mini-Book](https://www.infoq.com/minibooks/angular-mini-book/).

- `notes/Dockerfile` serves the Angular app with Nginx.
- `./gradlew bootJar -Pprod` in `notes-api` builds Angular into the Spring Boot JAR, and `./gradlew jibDockerBuild -Pprod` turns that into a Docker image.
