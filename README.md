![architecture](https://github.com/youssefshibl/websocket_microservices_with_redis_pubsub/assets/63800183/a5b7445f-e95e-467b-a8a4-44dc3d567c44)

## 🤿 Websocket Microservices With Redis pubsub
#### what is websocket microservices?
websocket microservices are microservices that use websockets to communicate with each other 
#### 🚧 what is redis pubsub?
redis pubsub is a pubsub (messaging bor) system that uses redis as a backend 

###	🚧 why Websocket Microservice not intergreted with webserver ? 
when websocket microservices integrate with webserver, it will be overloaded  with webserver request and response because of websocket connection transport data between client and server and do this many times with many clients , so it will be better to separate websocket microservice from webserver

###	🚧 how this architecture works?
assume that we have two clients client A and client B , A want send meesage to B , B want to send message to A , so how do this , first A send message to webserver with metadata like this 
```js
let message = {
    uuid_remote: UUID,
    uuid_local: UUID,
    message: message,
}
// uuid_remote : the uuid of the remote client
// uuid_local : the uuid of me 
// message : the message that client want to send to the remote client
```
this message get from client to webserver , webserver will take this messge and make some checkes on it and if it valid send it to redis pub_sub then websocket microservice will take this message and send it to the remote client throw websocket connection 
### 🚧 practical example

- when you open webpage , page will send reqeust to get token from server by any authentication method 
- server will send token client then client try to open connection with websocket microservice
- websocket microservice will send token to server to authenticate this connection
- server will send authentication valid of token 
- websocket microservice will accept this connection
- client will send message to server with uuid of remote client 
- server will send this message after make validation to this message 
- send this meesage to redis pubsub
- websocket microservice will take this message and send it to remote client

## 🚀 How run this architecture

- run redis stack container
  + go to redis_pub_sub directory 
  + add configuration file `local-redis-stack.conf`
  + there are two configuration in this file `port` and `time` to take snapshot from database and minumum keys number to do this
  + run `docker compose up -d` to make redis stack container
  + this will run `RedisInsight` web interface can access from `localhost:8001`
- run web sever
  + go to server directory 
  + run `node main.js`
  + this server has three endpoints 
    * `/token` -> endpoint used to get auth token then use it by clinet to connected to websocket 
    * `/auth/:token` -> endpoint using by websocket microservice to authenticate the connection of client
    * `/publish` -> endpoint used to send message to client by uuid of client

- run websocket microservice
  + go to ws_microservice directory 
  + run `node main.js`
  + this microservice which make websocket connection with client and make subscribe to redis pubsub and get record from redis and send it to target client

- open client page 
  + go to client directory 
  + open `index.html` in live server

---

### 🚧 How client look
![Screenshot from 2023-08-15 19-28-04](https://github.com/youssefshibl/websocket_microservices_with_redis_pubsub/assets/63800183/1123374b-7f62-470d-a5f2-cceacbb756ec)

the uuid which in above this is client uuid , client can send any message to other clinet but should know uuid of other client , to send message enter uuid of client and message and click publish this sned message to server which send it to redis pubsub which subscribed by websocket microservice and send it to other client




    