let mytoken = "";
async function SendMessage() {
  let UUID = document.getElementById("UUID").value;
  let message = document.getElementById("Message").value;
  let requestbody = {
    uuid_remote: UUID,
    uuid_local: mytoken,
    message: message,
  };
  // make requst to server to sned message to client with uuid remote and message
  await fetch("http://localhost:5000/publish", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(requestbody),
  });

  console.log("Message sent", requestbody);
}

(async () => {
  const ws = await connectToServer();
  // console all message get from ws
  ws.onmessage = function (e) {
    var server_message = e.data;
    console.log("server message" , server_message)
    let message = JSON.parse(server_message).message;
    document.querySelector(".message-recive-box").innerHTML += `<div class="message">${message}</div>`
    document.getElementById("Message").value = "";
  };
})();

async function connectToServer() {
  // get auth from server
  let token = await fetch("http://localhost:5000/token");
  token = await token.json();
  token = token.token;
  mytoken = token;
  document.querySelector(".uuid").innerHTML = token;
  console.log(token);
  const ws = new WebSocket(`ws://localhost:7071/ws?token=${token}`);
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      if (ws.readyState === 1) {
        clearInterval(timer);
        resolve(ws);
      }
    }, 10);
  });
}
