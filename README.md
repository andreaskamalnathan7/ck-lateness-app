# CK School Attendance System (FaceRecognition & QR)

A full-stack mobile application for tracking student lateness using QR Code scanning, Face Recognition (AI), and Geofencing.

## Prerequisites
Before running this project, ensure you have the following installed on your PC:
1. Node.js (v18 or higher)
2. MySQL
3. Android Studio (For mobile testing)
4. Git

## Project Setup
**1. Clone the Repository**

    git clone <your-github-repo-url>
    cd <project-folder-name>

**2. Backend Setup (Server)**

The backend handles authentication and database storage.
- Navigate to project root (where server.js is)

      npm install

- Setup Environment Variables

  Create a .env file and add your credentials:

      PORT=3000
      DB_HOST=your_host
      DB_USER=your_user
      DB_PASSWORD=your_password
      DB_NAME=your_database

**3. Database Initialization**

_Run the following SQL in your MySQL server to prepare the tables_

    CREATE TABLE students (
        student_id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        password VARCHAR(255),
        class VARCHAR(20),
        face_descriptor TEXT
    );
    
    CREATE TABLE lateness_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(50),
        arrival_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        reason TEXT,
        minutes_late INT,
        FOREIGN KEY (student_id) REFERENCES students(student_id)
    );

**4. Frontend Setup (Vue.js)**
- Install dependencies

      npm install

- Configure API
- Open src/config.js and update API_BASE_URL to your Local IP or server URL

## Running on Mobile (Capacitor)
To see the app on your phone or emulator:

1. Build the web app**

        npm run build

2. Sync files to the Android project**

        npx cap sync

3. Open in Android Studio**

        npx cap open android

## Installed Libraries
Library
- express & mysql2 : Powers the API and connects to our database.
- face-api.js : The AI engine for Face Recognition & Biometric detection.
- @capacitor/preferences : Equivalent to "TinyDB" - stores user tokens and sessions.
- @capacitor-mlkit/barcode-scanning : High-speed QR Code scanning.
- @capacitor/geolocation : Geofencing to ensure students scan only at school.
- bcrypt : Secures student passwords via hashing.

## Important Note
The Face Recognition models must be placed in public/models. When you run npm run build, these are automatically moved to the dist folder for the server to serve.

