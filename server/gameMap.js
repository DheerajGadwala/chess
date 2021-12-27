class GameMap {

    constructor() {
        this.mapWhite = new Map();
        this.mapBlack = new Map();
        this.mapGame = new Map();
        this.whiteId = new Map();
        this.blackId = new Map();
        this.mapSocketId = new Map();
    }

    setGameWhite = (gameId, socket, id)=> {
        this.mapWhite.set(gameId, socket);
        this.whiteId.set(gameId, id);
        this.mapSocketId.set(socket, id);
    }

    setGameBlack = (gameId, socket, id)=> {
        this.mapBlack.set(gameId, socket);
        this.blackId.set(gameId, id);
        this.mapSocketId.set(socket, id);
    }

    setGame = (gameId, game)=> {
        this.mapGame.set(gameId, game);
    }

    getWhiteSocket = (gameId)=> {
        return this.mapWhite.get(gameId);
    }

    getWhiteId = (gameId)=> {
        return this.whiteId.get(gameId);
    }

    getIdBySocket = (socket)=> {
        return this.mapSocketId.get(socket);
    }

    getBlackSocket = (gameId)=> {
        return this.mapBlack.get(gameId);
    }

    getBlackId = (gameId)=> {
        return this.blackId.get(gameId);
    }

    getGame = (gameId)=> {
        return this.mapGame.get(gameId);
    }

    has = (gameId)=> {
        return this.mapWhite.has(gameId);
    }
    
}

module.exports = GameMap