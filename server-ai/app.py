from flask import Flask, request
from flask_socketio import SocketIO
from flask_cors import CORS
from Game import Game
import random

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

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins=['http://localhost:3000', 'http://localhost:3000/chess'])
allGames = AllGames()

@app.route('/')
def hello():
    return 'Hello, World!'

@socketio.on('move')
def handle_message(gameId, rowFrom, colFrom, rowTo, colTo):
    white_socket_id = allGames.getWhiteSocket(gameId)
    black_socket_id = allGames.getBlackSocket(gameId)
    flag = allGames.getGame(gameId).move(rowFrom, colFrom, rowTo, colTo, 0 if white_socket_id == request.sid else 1 if black_socket_id == request.sid else 2)
    game = allGames.getGame(gameId)
    if flag:
        socketio.emit("moveUpdate", {"game": game.getJson(), "validity": "valid"}, room = white_socket_id)
        socketio.emit("moveUpdate", {"game": game.getJson(), "validity": "valid"}, room = black_socket_id)
    else:
        socketio.emit("moveUpdate", {"game": game.getJson(), "validity": "invalid"}, room = white_socket_id)
        socketio.emit("moveUpdate", {"game": game.getJson(), "validity": "invalid"}, room = black_socket_id)

@socketio.on('host')
def handle_host(data):
    x = makeId()
    while(True):
        x = makeId()
        if not allGames.has(x):
            allGames.setGameWhite(x, request.sid, makeId())
            break
    print('Id:', x)
    return {"gameId":x}

@socketio.on('join')
def handle_join(gameId):
    print(gameId)
    if allGames.has(gameId):
        allGames.setGameBlack(gameId, request.sid, makeId())
        allGames.setGame(gameId, Game(None, None, None))
        game = allGames.getGame(gameId)
        w_id = allGames.getWhiteSocket(gameId)
        b_id = allGames.getBlackSocket(gameId)
        socketio.emit("connected", {"game": game.getJson(), "gameId": gameId, "color": "white"}, room = w_id)
        socketio.emit("connected", {"game": game.getJson(), "gameId": gameId, "color": "black"}, room = b_id)
        return {"status":"connected", "game": allGames.getGame(gameId).getJson()}
    else:
        return {"status":"not connected"}


def makeId():
    text = ""
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for i in range(5):
        text += possible[random.randint(0, len(possible)-1)]
    return text

if __name__ == '__main__':
    # app.run()
    socketio.run(app)



