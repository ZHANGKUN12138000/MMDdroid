plugins {
    id("com.android.application")
}

android {
    namespace = "com.openai.mmdroid"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.openai.mmdroid"
        minSdk = 26
        targetSdk = 36
        versionCode = 22
        versionName = "0.21.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}


dependencies {
    implementation("androidx.documentfile:documentfile:1.1.0")
    implementation("com.github.junrar:junrar:8.1.1")
}
