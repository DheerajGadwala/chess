from flask import Flask, request
from flask_socketio import SocketIO
from flask_cors import CORS
from Game import Game
from AllGames import AllGames
import random
import AI

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins=['http://localhost:3000', 'http://localhost:3000/chess'])
allGames = AllGames()
aiGames = dict()

@app.route('/')
def hello():
    return 'Hello, World!'

@socketio.on('move')
def handle_message(gameId, rowFrom, colFrom, rowTo, colTo):
    if allGames.has(gameId):
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
    elif gameId in aiGames:
        sid, game, color = aiGames[gameId]
        flag = game.move(rowFrom, colFrom, rowTo, colTo, color)
        if not flag:
            socketio.emit("moveUpdate", {"game": game.getJson(), "validity": "invalid"}, room = sid)
        else:
            game = AI.makeMove(game)
            aiGames[gameId][1] = game 
            socketio.emit("moveUpdate", {"game": game.getJson(), "validity": "valid"}, room = sid)

@socketio.on('host')
def handle_host(data):
    x = makeId()
    while(True):
        x = makeId()
        if not allGames.has(x):
            allGames.setGameWhite(x, request.sid, makeId())
            break
    return {"gameId":x}

@socketio.on('join')
def handle_join(gameId):
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

@socketio.on('start_ai')
def handle_start_ai_game(player_color):
    x = makeId()
    while(True):
        x = makeId()
        if x not in aiGames:
            break
    aiGames[x] = [request.sid, Game(None, None, None), player_color]
    sid, game, color = aiGames[x]
    if player_color == 0:
        socketio.emit("connected_ai", {"game": game.getJson(), "gameId": x, "color": "white"}, room = sid)
        return {"status":"connected", "game": game.getJson()}
    else:
        socketio.emit("connected_ai", {"game": game.getJson(), "gameId": x, "color": "black"}, room = sid)
        game = AI.makeMove(game)
        aiGames[x][1] = game
        socketio.emit("moveUpdate", {"game": game.getJson(), "validity": "valid"}, room = sid)
        return {"status":"connected", "game": game.getJson()}


def makeId():
    text = ""
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for i in range(5):
        text += possible[random.randint(0, len(possible)-1)]
    return text

if __name__ == '__main__':
    # app.run()
    socketio.run(app)



