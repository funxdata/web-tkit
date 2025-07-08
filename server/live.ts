import { getLocalIP } from "./localip.ts";
const LOCAL_IP =  getLocalIP();
const ws = new WebSocket(`ws://${LOCAL_IP}:8864/live`);
ws.onmessage = (event) => {
  if (event.data === "reload") {
    console.log("Reloading page...");
    location.reload();
  }
};