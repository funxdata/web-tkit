const ws = new WebSocket("ws://localhost:8864/live");

ws.onmessage = (event) => {
    if (event.data === "reload") {
      console.log("Reloading page...");
      location.reload();
    }
  };