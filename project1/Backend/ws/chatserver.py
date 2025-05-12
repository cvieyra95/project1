import asyncio
import websockets
import json
import time
import os
import mysql.connector

clients = {}
counter = {}
MSG_LIMIT = 5 
WINDOW = 1    

def dbConnect():
    return mysql.connector.connect(
        host= os.environ.get("HOST"),
        port= int(os.environ.get("DB_PORT", 3306)),
        user= os.environ.get("USER"),
        password= os.environ.get("PASSWORD"),
        database= os.environ.get("NAME")
    )
async def handle_client(websocket, path=None):
    username = None

    try:
        username = await websocket.recv()  
        print(f"{username} connected")
    
        clients[username] = websocket
        counter[username] = []
        async for message in websocket:
            if not message:
                continue

            try:
                data = json.loads(message)
                now = time.time()

                recipient = data.get("recipient")
                # Rate limiting
                counter[username] = [t for t in counter[username] if now - t < WINDOW]
                if len(counter[username]) >= MSG_LIMIT:
                    print(f"Rate limit exceeded for {username}")
                    continue

                counter[username].append(now)

                if "fileContent" in data:
                    print(f"Received file from {username}: {data.get('fileName')}")
                    if recipient in clients:
                        await clients[recipient].send(json.dumps({
                            "sender": username,
                            "fileName": data.get("fileName"),
                            "fileType": data.get("fileType"),
                            "fileContent": data.get("fileContent"),
                        }))
                    continue 
        
                if "message" not in data:
                    print("Received JSON missing 'message' key:", data)
                    continue  

                if recipient in clients:
                    await clients[recipient].send(json.dumps({
                        "sender": username,
                        "message": data["message"]
                    }))
                log_messages(username, recipient, data["message"])

            except json.JSONDecodeError:
                print("Invalid JSON received")
                continue
    except websockets.exceptions.ConnectionClosed:
        print(f"{username} disconnected")
    except websockets.exceptions.ConnectionClosedError:
        print(f"{username} disconnected unexpectedly")
    except Exception as e:
        print(f"Unexpected error: {e}")
    finally:
        if username in clients:
            del clients[username]
        if username in counter:
            del counter[username]
        await websocket.close()

def log_messages(sender, recipient, message):
        try:
            connect = dbConnect()
            cursor = connect.cursor()
            timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
            cursor.execute(
            "INSERT INTO messages (sender, recipient, message, timestamp) VALUES (%s, %s, %s, %s)",
            (sender, recipient, message, timestamp)
            )
            connect.commit()
            cursor.close()
            connect.close()
        except mysql.connector.Error as err:
            print(f"Database error: {err}")

async def main():
    PORT = int(os.environ.get("PORT", 80))
    server = await websockets.serve(handle_client, "0.0.0.0", PORT) 
    print("WebSocket server started")
    await server.wait_closed()

asyncio.run(main())
