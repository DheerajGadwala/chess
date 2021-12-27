var express = require("express");
var app = express();
var http = require("http").createServer(app);
const io = require("socket.io")(http, {
   cors: {
     origin: [
      "http://localhost:3001", "http://localhost:3001/chess", 
     "http://dheerajgadwala.github.io/chess", "https://dheerajgadwala.github.io/chess",
     "http://www.dheerajgadwala.tech/chess", "https://www.dheerajgadwala.tech/chess",
     "http://www.dheerajgadwala.tech/", "https://www.dheerajgadwala.tech/",
     "http://dheerajgadwala.github.io/", "https://dheerajgadwala.github.io/",
     "http://dheerajgadwala.github.io", "https://dheerajgadwala.github.io",
     "http://www.dheerajgadwala.tech", "https://www.dheerajgadwala.tech",
   ],
   methods: ["GET", "POST"]
   }
 });

const Game = require("../game");
const GameMap = require("../gameMap.js");
const gameMap = new GameMap();

http.listen(process.env.PORT || 5000, () => {
   console.log("sidbcoskdncpok30298741078", process.env.PORT || 5000, process.env.PORT)
   io.on('connect', (socket) => {
      socket.on('host', (callBack) => {
         let x = makeid();
         while(true) {
            x = makeid();
            if(!gameMap.has(x)) {
               gameMap.setGameWhite(x, socket, makeid());
               break;
            }
         }
         callBack({gameId: x});
      });
      
      socket.on('join', (gameId, callBack) => {
         if (gameMap.has(gameId)) {
            gameMap.setGameBlack(gameId, socket, makeid());
            gameMap.setGame(gameId, new Game(null, null, null, gameMap.getWhiteId(gameId), gameMap.getBlackId(gameId)));
            callBack({status: "connected", game: gameMap.getGame(gameId)});
            let game = gameMap.getGame(gameId);
            gameMap.getWhiteSocket(gameId).emit("connected", {game: {turn: game.turn, board: game.board, deadPieces: game.deadPieces}, gameId: gameId, color: "white"});
            gameMap.getBlackSocket(gameId).emit("connected", {game: {turn: game.turn, board: game.board, deadPieces: game.deadPieces}, gameId: gameId, color: "black"});
         }
         else {
            callBack({status: "not connected"});
         }
      });
   
      socket.on('move', (gameId, rowFrom, colFrom, rowTo, colTo) => {
         let flag =  gameMap.getGame(gameId).move(rowFrom, colFrom, rowTo, colTo, gameMap.getWhiteSocket(gameId) === socket ? 0 : gameMap.getBlackSocket(gameId) === socket ? 1 : 2);
         let game = gameMap.getGame(gameId);
         if (flag) {
            gameMap.getWhiteSocket(gameId).emit('moveUpdate', {game: {turn: game.turn, board: game.board, deadPieces: game.deadPieces}, validity: "valid"});
            gameMap.getBlackSocket(gameId).emit('moveUpdate', {game: {turn: game.turn, board: game.board, deadPieces: game.deadPieces}, validity: "valid"});
         }
         else {
            gameMap.getWhiteSocket(gameId).emit('moveUpdate', {game: {turn: game.turn, board: game.board, deadPieces: game.deadPieces}, validity: "invalid"});
            gameMap.getBlackSocket(gameId).emit('moveUpdate', {game: {turn: game.turn, board: game.board, deadPieces: game.deadPieces}, validity: "invalid"});
         }
      });
   });
});

// const io = require("socket.io")(process.env.PORT || 5000, {
//    cors: {
//      origin: ["http://localhost:3001", "http://localhost:3001/chess", 
//      "http://DheerajGadwala.github.io/chess", "https://DheerajGadwala.github.io/chess",
//      "http://www.dheerajgadwala.tech/chess", "https://www.dheerajgadwala.tech/chess",
//      "http://www.dheerajgadwala.tech", "https://www.dheerajgadwala.tech",
//      "http://DheerajGadwala.github.io", "https://DheerajGadwala.github.io"
//    ]
//    }
//  });

const makeid = () => {
   var text = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

   for (var i = 0; i < 5; i++)
     text += possible.charAt(Math.floor(Math.random() * possible.length));
 
   return text;
 }