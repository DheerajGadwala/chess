import chess
import chess.engine
import random
import numpy
import tensorflow.keras.models as models
import tensorflow.keras.layers as layers
import tensorflow.keras.utils as utils
import tensorflow.keras.optimizers as optimizers
import tensorflow.keras.callbacks as callbacks
import os
from tensorflow.keras.callbacks import ModelCheckpoint
from tensorflow.keras import models
from Game import Game
import numpy as np
from generateSample import split_dims

# game = Game()
# board = chess.Board(game.generateFenString())
# print(game.generateFenString())
# print(board)

# this function will create our x (board)
# Will be used to create dataset to train the tensorflow model

def build_model(conv_size, conv_depth):
    board3d = layers.Input(shape=(14, 8, 8))

    # adding the convolutional layers
    x = board3d
    for _ in range(conv_depth):
        x = layers.Conv2D(filters=conv_size, kernel_size=3, padding='same', activation='relu')(x)
    x = layers.Flatten()(x)
    x = layers.Dense(64, 'relu')(x)
    x = layers.Dense(1, 'sigmoid')(x)

    return models.Model(inputs=board3d, outputs=x)


def get_dataset():
    container = numpy.load('data1.npz', allow_pickle=True)
    print(container)
    b, v = container['b'], container['v']
    v = numpy.asarray(v / abs(v).max() / 2 + 0.5, dtype=numpy.float32) # normalization (0 - 1)
    return b, v

model_file = "model.h5"
model = None
if not os.path.exists(model_file):
    print('A new model is being trained.')
    model = build_model(32, 4)
    x_train, y_train = get_dataset()
    x_train.transpose()
    model.compile(optimizer=optimizers.Adam(5e-4), loss='mean_squared_error')
    model.summary()
    checkpoint_filepath = '/tmp/checkpoint/'
    model_checkpointing_callback = ModelCheckpoint(
        filepath = checkpoint_filepath,
        save_best_only= True,
    )
    model.fit(x_train, y_train,
            batch_size=2048,
            epochs=1000,
            verbose=1,
            validation_split=0.1,
            callbacks=[callbacks.ReduceLROnPlateau(monitor='loss', patience=10),
                        callbacks.EarlyStopping(monitor='loss', patience=15, min_delta=1e-4),model_checkpointing_callback])
    print('Model has been saved.')
    model.save('model.h5')
else:
    print('existing model has been loaded.')
    model = models.load_model('model.h5')

# used for the minimax algorithm
def minimax_eval(board):
    board3d = split_dims(board)
    board3d = numpy.expand_dims(board3d, 0)
    return model(board3d)[0][0]


def minimax(board, depth, alpha, beta, maximizing_player):
    if depth == 0 or board.is_game_over():
        return minimax_eval(board)
  
    if maximizing_player:
        max_eval = -numpy.inf
        for move in board.legal_moves:
            board.push(move)
            eval = minimax(board, depth - 1, alpha, beta, False)
            board.pop()
            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                break
        return max_eval
    else:
        min_eval = numpy.inf
        for move in board.legal_moves:
            board.push(move)
            eval = minimax(board, depth - 1, alpha, beta, True)
            board.pop()
            min_eval = min(min_eval, eval)
            beta = min(beta, eval)
            if beta <= alpha:
                break
        return min_eval


# this is the actual function that gets the move from the neural network
def get_ai_move(board, depth=3):
    moves = []
    for move in board.legal_moves:
        board.push(move)
        eval = minimax(board, depth - 1, -numpy.inf, numpy.inf, False)
        board.pop()
        moves.append([move, eval])
    moves.sort(key = lambda x: -x[1])
    choice = random.choices([i[0] for i in moves[:3]], weights=[i[1]**2 for i in moves[:3]], k=1)[0]
    return choice

def makeMove(game):
    # print(game.generateFenString())
    board = chess.Board(game.generateFenString())
    best_move = get_ai_move(board)
    board.push(best_move)
    print(board.fen())
    return Game.createGame(board.fen())

    
game = Game()
game = makeMove(game)