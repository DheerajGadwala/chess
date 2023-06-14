class Game:
    def __init__(self, turn=None, board=None, deadPieces=None):
        if turn is not None and board is not None and deadPieces is not None:
            self.turn = turn
            self.board = board
            self.deadPieces = deadPieces
        else:
            self.turn = 0
            self.board = []
            self.deadPieces = []
            for i in range(8):
                col = []
                for j in range(8):
                    piece = None
                    if i == 0:
                        piece = Piece(1, j + 1)
                    elif i == 1:
                        piece = Piece(1, 0)
                    elif i == 6:
                        piece = Piece(0, 0)
                    elif i == 7:
                        piece = Piece(0, j + 1)
                    col.append(Square((i + j) % 2, piece))
                self.board.append(col)

    def getBoard(self):
        return self.board

    def isOnBoard(self, row, col):
        return row >= 0 and row < 8 and col >= 0 and col < 8

    def isOccupied(self, row, col):
        return self.isOnBoard(row, col) and self.board[row][col].getPiece() is not None

    def isNotOccupied(self, row, col):
        return self.isOnBoard(row, col) and self.board[row][col].getPiece() is None

    def underCheck(self, color):
        kingPos = None
        for i in range(8):
            for j in range(8):
                piece = self.board[i][j].getPiece()
                if piece is not None and piece.isKing() and piece.color == color:
                    kingPos = [i, j]
                    break
            if kingPos is not None:
                break
        danger = False
        for i in range(8):
            for j in range(8):
                piece = self.board[i][j].getPiece()
                if piece is not None and piece.color != color:
                    moves = self._getValidMovesHelper(i, j)
                    for move in moves:
                        if move[0] == kingPos[0] and move[1] == kingPos[1]:
                            danger = True
                            break
                    if danger:
                        break
            if danger:
                break
        return danger

    def getDeadPieces(self):
        return self.deadPieces

    def copyGame(self):
        boardCopy = []
        for i in range(8):
            col = []
            for j in range(8):
                col.append(self.board[i][j].getCopy())
            boardCopy.append(col)
        deadPiecesCopy = []
        for deadPiece in self.deadPieces:
            deadPiecesCopy.append(deadPiece.getCopy())
        return Game(self.turn, boardCopy, deadPiecesCopy)
    
    def getValidMoves(self, row, col):
        if self.board[row][col].getPiece().color != self.turn:
            return []
        elif self.underCheck(self.turn):
            allMoves = self._getValidMovesHelper(row, col)
            legalMoves = []
            for move in allMoves:
                gameCopy = self.copyGame()
                gameCopy._forceMove(row, col, move[0], move[1])
                if not gameCopy.underCheck(self.turn):
                    legalMoves.append(move)
            if self.board[row][col].getPiece().isKing():
                legalMoves += self.getCastleMoves()
            return legalMoves
        else:
            allMoves = self._getValidMovesHelper(row, col)
            legalMoves = []
            for move in allMoves:
                gameCopy = self.copyGame()
                gameCopy._forceMove(row, col, move[0], move[1])
                if not gameCopy.underCheck(self.turn):
                    legalMoves.append(move)
            if self.board[row][col].getPiece().isKing():
                legalMoves += self.getCastleMoves()
            return legalMoves

    def _getValidMovesHelper(self, row, col):
        moves = []
        piece = self.board[row][col].getPiece()
        if piece.isRook() or piece.isQueen():
            for i in range(1, 8):
                if self.isNotOccupied(row, col + i):
                    moves.append([row, col + i])
                else:
                    if self.isOccupied(row, col + i) and piece.isEnemy(self.board[row][col + i].getPiece()):
                        moves.append([row, col + i])
                    break
            for i in range(1, 8):
                if self.isNotOccupied(row, col - i):
                    moves.append([row, col - i])
                else:
                    if self.isOccupied(row, col - i) and piece.isEnemy(self.board[row][col - i].getPiece()):
                        moves.append([row, col - i])
                    break
            for i in range(1, 8):
                if self.isNotOccupied(row + i, col):
                    moves.append([row + i, col])
                else:
                    if self.isOccupied(row + i, col) and piece.isEnemy(self.board[row + i][col].getPiece()):
                        moves.append([row + i, col])
                    break
            for i in range(1, 8):
                if self.isNotOccupied(row - i, col):
                    moves.append([row - i, col])
                else:
                    if self.isOccupied(row - i, col) and piece.isEnemy(self.board[row - i][col].getPiece()):
                        moves.append([row - i, col])
                    break
        if piece.isKnight():
            if self.isNotOccupied(row + 1, col + 2) or (self.isOccupied(row + 1, col + 2) and piece.isEnemy(self.board[row + 1][col + 2].getPiece())):
                moves.append([row + 1, col + 2])
            if self.isNotOccupied(row + 1, col - 2) or (self.isOccupied(row + 1, col - 2) and piece.isEnemy(self.board[row + 1][col - 2].getPiece())):
                moves.append([row + 1, col - 2])
            if self.isNotOccupied(row - 1, col + 2) or (self.isOccupied(row - 1, col + 2) and piece.isEnemy(self.board[row - 1][col + 2].getPiece())):
                moves.append([row - 1, col + 2])
            if self.isNotOccupied(row - 1, col - 2) or (self.isOccupied(row - 1, col - 2) and piece.isEnemy(self.board[row - 1][col - 2].getPiece())):
                moves.append([row - 1, col - 2])
            if self.isNotOccupied(row + 2, col + 1) or (self.isOccupied(row + 2, col + 1) and piece.isEnemy(self.board[row + 2][col + 1].getPiece())):
                moves.append([row + 2, col + 1])
            if self.isNotOccupied(row + 2, col - 1) or (self.isOccupied(row + 2, col - 1) and piece.isEnemy(self.board[row + 2][col - 1].getPiece())):
                moves.append([row + 2, col - 1])
            if self.isNotOccupied(row - 2, col + 1) or (self.isOccupied(row - 2, col + 1) and piece.isEnemy(self.board[row - 2][col + 1].getPiece())):
                moves.append([row - 2, col + 1])
            if self.isNotOccupied(row - 2, col - 1) or (self.isOccupied(row - 2, col - 1) and piece.isEnemy(self.board[row - 2][col - 1].getPiece())):
                moves.append([row - 2, col - 1])
        if piece.isBishop() or piece.isQueen():
            flag = False
            for i in range(1, 8):
                if self.isNotOccupied(row + i, col + i):
                    moves.append([row + i, col + i])
                    flag = True
                elif self.isOnBoard(row + i, col + i):
                    if piece.isEnemy(self.board[row + i][col + i].getPiece()):
                        moves.append([row + i, col + i])
                    break
                elif flag:
                    break
            flag = False
            for i in range(1, 8):
                if self.isNotOccupied(row + i, col - i):
                    moves.append([row + i, col - i])
                    flag = True
                elif self.isOnBoard(row + i, col - i):
                    if piece.isEnemy(self.board[row + i][col - i].getPiece()):
                        moves.append([row + i, col - i])
                    break
                elif flag:
                    break
            flag = False
            for i in range(1, 8):
                if self.isNotOccupied(row - i, col + i):
                    moves.append([row - i, col + i])
                    flag = True
                elif self.isOnBoard(row - i, col + i):
                    if piece.isEnemy(self.board[row - i][col + i].getPiece()):
                        moves.append([row - i, col + i])
                    break
                elif flag:
                    break
            flag = False
            for i in range(1, 8):
                if self.isNotOccupied(row - i, col - i):
                    moves.append([row - i, col - i])
                    flag = True
                elif self.isOnBoard(row - i, col - i):
                    if piece.isEnemy(self.board[row - i][col - i].getPiece()):
                        moves.append([row - i, col - i])
                    break
                elif flag:
                    break
        if piece.isKing():
            for i in range(-1, 2):
                for j in range(-1, 2):
                    if self.isNotOccupied(row + i, col + j):
                        moves.append([row + i, col + j])
                    elif self.isOccupied(row + i, col + j) and piece.isEnemy(self.board[row + i][col + j].getPiece()):
                        moves.append([row + i, col + j])
        if piece.isPawn() and piece.isBlack():
            for i in range(1, (2 if piece.moveCount == 0 else 1) + 1):
                if self.isOccupied(row + i, col):
                    break
                moves.append([row + i, col])
            if self.isOccupied(row + 1, col + 1) and piece.isEnemy(self.board[row + 1][col + 1].getPiece()):
                moves.append([row + 1, col + 1])
            if self.isOccupied(row + 1, col - 1) and piece.isEnemy(self.board[row + 1][col - 1].getPiece()):
                moves.append([row + 1, col - 1])
        elif piece.isPawn() and piece.isWhite():
            for i in range(1, (2 if piece.moveCount == 0 else 1) + 1):
                if self.isOccupied(row - i, col):
                    break
                moves.append([row - i, col])
            if self.isOccupied(row - 1, col + 1) and piece.isEnemy(self.board[row - 1][col + 1].getPiece()):
                moves.append([row - 1, col + 1])
            if self.isOccupied(row - 1, col - 1) and piece.isEnemy(self.board[row - 1][col - 1].getPiece()):
                moves.append([row - 1, col - 1])
        return moves

    def isThreatened(self, row, col):
        danger = False
        for i in range(8):
            for j in range(8):
                piece = self.board[i][j].getPiece()
                if piece is not None and piece.color != self.turn:
                    moves = self._getValidMovesHelper(i, j)
                    for move in moves:
                        if move[0] == row and move[1] == col:
                            danger = True
        return danger

    def getCastleMoves(self):
        possibilities = self.isCastlePossible()
        moves = []
        kPos = 4
        side = 7 if self.turn == 0 else 0
        if possibilities[0]:
            moves.append([side, kPos - 2, 1])
        if possibilities[1]:
            moves.append([side, kPos + 2, 1])
        return moves

    def isCastlePossible(self):
        kPos = 4
        lRook = 0
        rRook = 7
        side = 7 if self.turn == 0 else 0
        lr = self.board[side][lRook].getPiece()
        rr = self.board[side][rRook].getPiece()
        k = self.board[side][kPos].getPiece()
        if k is not None and k.isKing() and k.moveCount == 0:
            # Check left 
            # Check for threats in the king's path.
            leftPossibility = not self.isThreatened(side, kPos) and not self.isThreatened(side, kPos - 1) and not self.isThreatened(side, kPos - 2)
            # Check if path is clear.
            leftPossibility = leftPossibility and self.board[side][kPos - 1].getPiece() is None and self.board[side][kPos - 2].getPiece() is None and self.board[side][kPos - 3].getPiece() is None
            # Check if rook is at the position and not moved yet.
            leftPossibility = leftPossibility and lr is not None and lr.isRook() and lr.moveCount == 0
            # Check right
            # Check for threats in the king's path.
            rightPossibility = not self.isThreatened(side, kPos) and not self.isThreatened(side, kPos + 1) and not self.isThreatened(side, kPos + 2)
            # Check if path is clear.
            rightPossibility = rightPossibility and self.board[side][kPos + 1].getPiece() is None and self.board[side][kPos + 2].getPiece() is None
            # Check if rook is at the position and not moved yet.
            rightPossibility = rightPossibility and rr is not None and rr.isRook() and rr.moveCount == 0

            return [leftPossibility, rightPossibility]
        return [False, False]

    def move(self, rowf, colf, rowt, colt, player):
        if player != self.turn:
            return False
        
        validMoves = self.getValidMoves(rowf, colf)
        moved = False
        
        # Special Case: Castling
        if self.board[rowf][colf].getPiece().isKing():
            castleMoves = self.getCastleMoves()
            for move in castleMoves:
                if move[0] == rowt and move[1] == colt:
                    self.board[rowt][colt].setPiece(self.board[rowf][colf].getPiece())
                    self.board[rowf][colf].removePiece()
                    if colt == 6:
                        self.board[rowt][5].setPiece(self.board[rowf][7].getPiece())
                        self.board[rowf][7].removePiece()
                    else:
                        self.board[rowt][3].setPiece(self.board[rowf][0].getPiece())
                        self.board[rowf][0].removePiece()
                    self.turn = 1 if self.turn == 0 else 0
                    moved = True
        
        if not moved:
            for move in validMoves:
                if move[0] == rowt and move[1] == colt:
                    self.board[rowf][colf].getPiece().moveCount += 1
                    if self.board[rowt][colt].getPiece() is not None:
                        self.deadPieces.append(self.board[rowt][colt].getPiece())
                    self.board[rowt][colt].setPiece(self.board[rowf][colf].getPiece())
                    self.board[rowf][colf].removePiece()
                    if self.board[rowt][colt].getPiece().isPawn():
                        if rowt == 0 or rowt == 7:
                            self.board[rowt][colt].getPiece().promote()
                    self.turn = 1 if self.turn == 0 else 0
                    moved = True
        
        return moved

    def _forceMove(self, rowf, colf, rowt, colt):
        self.board[rowf][colf].getPiece().moveCount += 1
        if self.board[rowt][colt].getPiece() is not None:
            self.deadPieces.append(self.board[rowt][colt].getPiece())
        self.board[rowt][colt].setPiece(self.board[rowf][colf].getPiece())
        self.board[rowf][colf].removePiece()
        if self.board[rowt][colt].getPiece().isPawn():
            if rowt == 0 or rowt == 7:
                self.board[rowt][colt].getPiece().promote()
        self.turn = 1 if self.turn == 0 else 0


    def isGameOver(self):
        for i in range(8):
            for j in range(8):
                piece = self.board[i][j].getPiece()
                if piece is not None and piece.color == self.turn:
                    moves = self.getValidMoves(i, j)
                    if len(moves) > 0:
                        return False
        return True

    def getJson(self):
        return {"turn": self.turn, "board": [[i.getJson() for i in j] for j in self.board], "deadPieces":[i.getJson() for i in self.deadPieces]}


class Piece:
    def __init__(self, color, type):
        self.moveCount = 0
        self.color = color
        if type == 0:
            self.type = 0  # pawn
        elif type == 1 or type == 8:
            self.type = 1  # rook
        elif type == 2 or type == 7:
            self.type = 2  # knight
        elif type == 3 or type == 6:
            self.type = 3  # bishop
        elif type == 4:
            self.type = 4  # queen
        elif type == 5:
            self.type = 5  # king

    def getCopy(self):
        return Piece(self.color, self.type)

    def promote(self):
        self.type = 4  # promote to queen

    def isPawn(self):
        return self.type == 0

    def isKnight(self):
        return self.type == 2

    def isBishop(self):
        return self.type == 3

    def isRook(self):
        return self.type == 1

    def isQueen(self):
        return self.type == 4

    def isKing(self):
        return self.type == 5

    def isWhite(self):
        return self.color == 0

    def isBlack(self):
        return self.color == 1

    def isEnemy(self, that):
        return that.color != self.color

    def getJson(self):
        return {'moveCount': self.moveCount, 'color': self.color, 'type': self.type}



class Square:
    def __init__(self, color, piece):
        self.color = color
        self.piece = piece

    def getCopy(self):
        return Square(self.color, self.piece.getCopy() if self.piece is not None else None)

    def isWhite(self):
        return self.color == 0

    def isBlack(self):
        return self.color == 1

    def getPiece(self):
        return self.piece

    def setPiece(self, piece):
        self.piece = piece

    def removePiece(self):
        self.piece = None

    def getJson(self):
        return {'color': self.color, 'piece': None if self.piece is None else self.piece.getJson()}
