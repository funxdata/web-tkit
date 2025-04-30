const ws = new WebSocket("ws://127.0.0.1:8864/live");

ws.onmessage = (event) => {
  if (event.data === "reload") {
    console.log("Reloading page...");
    location.reload();
  }
};