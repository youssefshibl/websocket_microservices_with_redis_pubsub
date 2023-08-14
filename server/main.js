var express = require("express");
const redis = require("redis");
var cors = require("cors");
var bodyParser = require('body-parser')


var app = express();
app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

const publisher = redis.createClient();

app.post("/publish", async function (req, res) {
  
console.log(req.body)
  await publisher.publish("article", JSON.stringify(req.body));
  res.json({
    status: true,
  })
});

// get token from server by client
let UsersToken = [];
app.get("/token", async function (req, res) {
  let uuid = uuidv4();
  UsersToken.push(uuid);
  console.log("all users token -> ", UsersToken);

  res.json({
    token: uuid,
  });
});

//  make auth by client by token from websocket
app.get("/auth/:token", async function (req, res) {
  let token = req.params.token;
  // check if token in usersToken
  console.log(token);
  if (UsersToken.includes(token)) {
    res.json({
      auth: true,
    });
  } else {
    res.json({
      auth: false,
    });
  }
});

(async () => {
  await publisher.connect();
  app.listen(5000, () => {
    console.log("Server is listening on port 5000");
  });
})();

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
