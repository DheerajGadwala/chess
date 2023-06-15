class AllGames:

    def __init__(self):
        self.mapWhite = dict()
        self.mapBlack = dict()
        self.mapGame = dict()
        self.whiteId = dict()
        self.blackId = dict()
        self.mapSocketId = dict()

    def setGameWhite(self, gameId, socket, id):
        self.mapWhite[gameId] = socket
        self.whiteId[gameId] = id
        self.mapSocketId[socket] = id

    def setGameBlack(self, gameId, socket, id):
        self.mapBlack[gameId] = socket
        self.blackId[gameId] = id
        self.mapSocketId[socket] = id

    def setGame(self, gameId, game):
        self.mapGame[gameId] = game

    def getWhiteSocket(self, gameId):
        return self.mapWhite[gameId]
    
    def getWhiteId(self, gameId):
        return self.whiteId[gameId]
    
    def getBlackSocket(self, gameId):
        return self.mapBlack[gameId]
    
    def getBlackId(self, gameId):
        return self.blackId[gameId]
    
    def getIdBySocket(self, socket):
        return self.mapSocketId[socket]
    
    def getGame(self, gameId):
        return self.mapGame[gameId]
    
    def has(self, gameId):
        return gameId in self.mapWhite
