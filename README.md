# Secure Chat

As a security analyst I was tasked with developing a real-time communication tool called SecureChat, aimed for remote teams that require secure and efficient communication without relying on third-party services. This application focuses on websocket-based communication.

## Key Features
1. Real-Time Messaging
2. Secure Connection
3. User Authentication
4. Rate Limiting
5. Connection Handling

## Technology
- Frontend: React.js
- Backend: Python
- Database: MySQL

## Getting Started

### Prerequisites
- Node.js
- Python
- MySQL

### Setup 

1. Clone the repository:

   ```
   git clone https://github.com/cvieyra95/project1.git
   cd project1
   ```
2. Setup Database:
   -Navigate to database directory

      ```
      cd Backend
      ```
      -Run database file

    ```
      python database.py
      ```
3. Setup Websocket Server:
  -Navigate to server directory
   ```
   cd Backend
   ```
  - Run server file 
      ```
    python chatserver.py
      ```
4. Run Frontend
   -Navigate to front end directory
   ```
   cd Frontend
   cd chat-app
   ```
   -Then run front end code
   ```
   npm install
   npm start
   ```





