const Game = require("../server/model/game");
const mapW = new Map();
const mapB = new Map();
const mapGame = new Map();

const io = require("socket.io")(5000, {
   cors: {
     origin: ["http://localhost:3001"]
   }
 });

io.on('connect', (socket) => {
   socket.on('host', (callBack) => {
      let x = makeid();
      while(true) {
         x = makeid();
         if(!mapW.has(x)) {
            mapW.set(x, socket);
            mapGame.set(x, new Game())
            break;
         }
      }
      callBack({gameId: x});
   });
   
   socket.on('join', (gameId, callBack) => {
      if (mapW.has(gameId)) {
         mapB.set(gameId, socket);
         mapW.get(gameId).emit("connected", {status: "OK"});
         callBack({status: "connected"});
         // TODO
      }
      else {
         callBack({status: "not connected"});
      }
   });
});

const makeid = () => {
   var text = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

   for (var i = 0; i < 5; i++)
     text += possible.charAt(Math.floor(Math.random() * possible.length));
 
   return text;
 }