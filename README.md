# Secure Chat

As a security analyst I was tasked with developing a real-time communication tool called SecureChat, aimed for remote teams that require secure and efficient communication without relying on third-party services. This application focuses on websocket-based communication.

## Key Features
1. Real-Time Messaging
2. Secure Connection
3. User Authentication
4. Message Encryption
5. Rate Limiting
6. Connection Handling
7. User-Friendly GUI
8. Chat with multiple users
9. File Shring Capablitiles
10. Emojis 

## Technology
- Frontend: React.js
- Backend: Python
- Database: MySQL

## Getting Started

### Prerequisites
#### Make sure these are installed or else it wont work
- Node.js and npm 
- Python
- MySQL

### Setup 

1. Clone the repository:

   ```
   git clone https://github.com/cvieyra95/project1.git
   cd project1
   ```
2. Setup Database: 
    - Navigate to database directory
   ```
   cd Backend
   ```
   - Before running database file, make sure to enter credentials to mysql database, it should look like this
   ```Python
   app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:password@localhost/databasename"
   ```
    - Run database file
    ```
    python database.py
    ```
    - This database stores all of users and their passwords
      
4. Setup Websocket Server: 
  - Navigate to server directory
   ```
   cd Backend
   ```
  - Run server file 
      ```
    python chatserver.py
      ```
  - This will run the websocket server on:
      ```
      ws://ipaddress:8080
      ```
4. Run Frontend 
   - Navigate to front end directory
   ```
   cd Frontend
   cd chat-app
   ```
   - Then run front end code
   ```
   npm install
   npm start
   ```
   - This will launch the website on the browser on:
   ```
   http://ipaddress:3000
   ```

   # How to use
1. Once everything is running, Open the web application in your browser http://ipaddress:3000
2. Login to your account
3. If you dont have an account you can sign up and create an account
4. Once you successfully login you can now securly chat!





