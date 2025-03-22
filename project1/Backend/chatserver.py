import asyncio
import websockets
import json
import time

clients = {}

counter = {}
conversations = {}
MSG_LIMIT = 5 #msg per
WINDOW = 1 #second

async def handle_client(websocket, path=None):
    username = None
    try:
        username = await websocket.recv()  
        print(f"{username} connected")
        clients[websocket] = username 
        counter[username] =[] 

        async for message in websocket:
            if not message:
                continue

            try:
                data = json.loads(message)
                now = time.time()

                counter[username] = [t for t in counter[username] if now - t < WINDOW]
                if len(counter[username]) >= MSG_LIMIT:
                    print("rate limit exceeded")
                    continue
                
                counter[username].append(now)

                if "message" in data:
                    print(f"Received from {username}: {data}")
                elif "filename" in data and "fileContent" in data:
                    print(f"Received file from {username}: {data['fileName']}")

                for client in clients:
                    if client != websocket:
                        if "message" in data:
                            await client.send(json.dumps({"sender": username, "message": data["message"]}))
                        elif "fileName" in data and "fileContent" in data:
                            await client.send(json.dumps({
                            "sender": username,
                            "fileName": data["fileName"],
                            "fileType": data["fileType"],
                            "fileContent": data["fileContent"]
                }))


            except json.JSONDecodeError:
                print("Invalid JSON received")
                continue
    except websockets.exceptions.ConnectionClosed:
        print(f"{username} disconnected")
    finally:
        if websocket in clients:
            del clients[websocket]
        if username in counter:
            del counter[username]
        await websocket.close()

async def main():
    server = await websockets.serve(handle_client, "localhost", 8080) 
    print("WebSocket server started on ws://localhost:8080")
    await server.wait_closed()

asyncio.run(main())
