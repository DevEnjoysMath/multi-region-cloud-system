import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    java
    id("org.springframework.boot") version "4.0.1"
    id("io.spring.dependency-management") version "1.1.7"
    id("org.graalvm.buildtools.native") version "0.10.6"
}

group = "com.sweng"

version = "0.0.1-SNAPSHOT"

description = "Sweng Group 26 Backend"

java { toolchain { languageVersion = JavaLanguageVersion.of(25) } }

repositories { mavenCentral() }

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-webmvc")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    testImplementation("org.springframework.boot:spring-boot-starter-security-test")
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> { useJUnitPlatform() }

tasks.withType<Javadoc> {
    options.encoding = "UTF-8"
    setFailOnError(true)

    val options = options as StandardJavadocDocletOptions
    // Fail when required Javadoc is missing
    options.addBooleanOption("Xdoclint:missing", true)
    options.addBooleanOption("Werror", true)
    options.addStringOption("Xmaxwarns", "1000")
}

tasks.named<BootJar>("bootJar") { archiveFileName.set("backend.jar") }
