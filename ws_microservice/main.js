const redis = require("redis");
const WebSocket = require("ws");
const url = require("url");
const axios = require("axios");

const clients = new Map();
const wss = new WebSocket.Server({ port: 7071 });

// save client metadata
wss.on("connection", async (ws, req) => {
  // get tokent from url to make auth
  const { query } = url.parse(req.url, true);
  const token = query.token;
  console.log("token -> ", token);
  if (!token) {
    ws.close();
    return;
  }
  // send request to server to auth user token
  const auth = await axios.get(`http://localhost:5000/auth/${token}`, {});
  console.log(auth.data);
  if (auth.data.auth) {
    clients.set(token, ws);
    ConsoleAllClients();
    // remov from clients when client disconnects
    ws.on("close", (ws) => {
      console.log("Client disconnected");
      clients.delete(token);
      ConsoleAllClients();
    });
  }else{
    ws.close();
    console.log(`Client ${token} disconnected`);
  }
});

(async () => {
  const client = redis.createClient();

  const subscriber = client.duplicate();

  await subscriber.connect();
  console.log("Subscriber connected");
  await subscriber.subscribe("article", (message) => {
    let record = JSON.parse(message);
    

    // send message to all connected clients
    // [...clients.values()].forEach((client) => {
    //   client.send(message);
    // });
    let client = clients.get(record.uuid_remote);
    if(client){
      client.send(JSON.stringify({
        message : record.message
      }));
    }
  });
})();

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function ConsoleAllClients() {
  // print all clients metadata
  [...clients.keys()].forEach((uuid_client) => {
    console.log(uuid_client);
  });
  console.log("--------------------------------");
}
