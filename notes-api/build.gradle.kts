import com.github.gradle.node.npm.task.NpxTask

plugins {
	kotlin("jvm") version "2.3.21"
	kotlin("plugin.spring") version "2.3.21"
	id("org.springframework.boot") version "4.1.2"
	id("io.spring.dependency-management") version "1.1.7"
	kotlin("plugin.jpa") version "2.3.21"
	id("com.github.node-gradle.node") version "7.1.0"
	id("com.google.cloud.tools.jib") version "3.5.4"
}

group = "com.okta.developer"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-h2console")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-data-rest")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-webmvc")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
	implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
	implementation("org.jetbrains.kotlin:kotlin-reflect")
	implementation("tools.jackson.module:jackson-module-kotlin")
	if (project.hasProperty("prod")) {
		runtimeOnly("org.postgresql:postgresql")
	} else {
		runtimeOnly("com.h2database:h2")
	}
	testImplementation("org.springframework.boot:spring-boot-starter-data-jpa-test")
	testImplementation("org.springframework.boot:spring-boot-starter-data-rest-test")
	testImplementation("org.springframework.boot:spring-boot-starter-validation-test")
	testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
	compilerOptions {
		freeCompilerArgs.addAll("-Xjsr305=strict", "-Xannotation-default-target=param-property")
	}
}

allOpen {
	annotation("jakarta.persistence.Entity")
	annotation("jakarta.persistence.MappedSuperclass")
	annotation("jakarta.persistence.Embeddable")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

val profile = if (project.hasProperty("prod")) "prod" else "dev"

tasks.bootRun {
    args("--spring.profiles.active=${profile}")
}

val spa = "${projectDir}/../notes"

node {
    download.set(true)
    version.set("24.22.1")
    nodeProjectDir.set(file(spa))
}

val buildWeb = tasks.register<NpxTask>("buildNpm") {
    dependsOn(tasks.npmInstall)
    command.set("ng")
    args.set(listOf("build"))
    inputs.dir("${spa}/src")
    inputs.dir(fileTree("${spa}/node_modules").exclude("${spa}/.cache"))
    outputs.dir("${spa}/dist")
}

tasks.processResources {
    rename("application-${profile}.properties", "application.properties")
    if (profile == "prod") {
        dependsOn(buildWeb)
        from("${spa}/dist/notes/browser") {
            into("static")
        }
    }
}

jib {
    from {
        platforms {
            platform {
                architecture = (findProperty("jibArchitecture") ?: "amd64").toString()
                os = "linux"
            }
        }
    }
    to {
        image = "mraible/bootiful-angular"
    }
    container {
        environment = mapOf("SPRING_PROFILES_ACTIVE" to profile)
        // Use only the C1 compiler: much faster startup on a small CPU, at some cost to peak throughput
        jvmFlags = listOf("-XX:TieredStopAtLevel=1")
    }
}

tasks.bootBuildImage {
    environment.set(mapOf(
        // Create a CDS archive with a training run, and use only the C1 compiler, for faster startup
        "BP_JVM_CDS_ENABLED" to "true",
        "BPE_DELIM_JAVA_TOOL_OPTIONS" to " ",
        "BPE_APPEND_JAVA_TOOL_OPTIONS" to "-XX:TieredStopAtLevel=1 -XX:ReservedCodeCacheSize=48M",
        // Paketo's memory calculator assumes 250 threads, which doesn't fit in 512 MB (Render's free plan)
        "BPE_OVERRIDE_BPL_JVM_THREAD_COUNT" to "50",
        // The training run starts the app without a database or Auth0, so give it placeholders
        "TRAINING_RUN_JAVA_TOOL_OPTIONS" to listOf(
            "-DAUTH0_ISSUER=https://example.auth0.com/", "-DAUTH0_AUDIENCE=training",
            "-DAUTH0_CLIENT_ID=training", "-DAUTH0_CLIENT_SECRET=training",
            // a provider with fixed endpoints, so the training run doesn't fetch Auth0's OIDC discovery document
            "-Dspring.security.oauth2.client.registration.auth0.provider=training",
            "-Dspring.security.oauth2.client.registration.auth0.authorization-grant-type=authorization_code",
            "-Dspring.security.oauth2.client.registration.auth0.redirect-uri={baseUrl}/login/oauth2/code/{registrationId}",
            "-Dspring.security.oauth2.client.provider.training.authorization-uri=https://example.auth0.com/authorize",
            "-Dspring.security.oauth2.client.provider.training.token-uri=https://example.auth0.com/oauth/token",
            "-Dspring.security.oauth2.client.provider.training.jwk-set-uri=https://example.auth0.com/.well-known/jwks.json",
            "-Dspring.jpa.properties.hibernate.boot.allow_jdbc_metadata_access=false",
            "-Dspring.jpa.hibernate.ddl-auto=none",
            "-Dspring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect",
        ).joinToString(" "),
    ))
}
