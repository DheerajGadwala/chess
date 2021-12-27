const Game = require("../server/model/game");
const GameMap = require("../server/model/gameMap");
const gameMap = new GameMap();

const io = require("socket.io")(process.env.PORT || 5000, {
   cors: {
     origin: ["http://localhost:3001"]
   }
 });

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

const makeid = () => {
   var text = "";
   var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

   for (var i = 0; i < 5; i++)
     text += possible.charAt(Math.floor(Math.random() * possible.length));
 
   return text;
 }