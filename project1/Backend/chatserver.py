import asyncio
import websockets
import json

clients = {}

async def handle_client(websocket, path=None):
    username = None
    try:
        username = await websocket.recv()  
        print(f"{username} connected")
        clients[websocket] = username  

        async for message in websocket:
            if not message:
                continue

            try:
                data = json.loads(message)
                print(f"Received from {username}: {data}")
                for client in clients:
                    if client != websocket:
                        await client.send(json.dumps({"sender": username, "message": data["message"]}))

            except json.JSONDecodeError:
                print("Invalid JSON received")
                continue

    except websockets.exceptions.ConnectionClosed:
        print(f"{username} disconnected")
    finally:
        if websocket in clients:
            del clients[websocket]
        await websocket.close()

async def main():
    server = await websockets.serve(handle_client, "localhost", 8080) 
    print("WebSocket server started on ws://localhost:8080")
    await server.wait_closed()

asyncio.run(main())
