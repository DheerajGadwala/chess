class Game {

    constructor(turn, board, deadPieces) {
        if (turn !== null && board !== null && deadPieces !== null) {
            this.turn = turn;
            this.board = board;
            this.deadPieces = deadPieces;
        }
        else {
            this.turn = 0;
            this.board = [];
            this.deadPieces = [];
            for(var i = 0; i < 8; i++) {
                let col = [];
                for (var j = 0; j < 8; j++) {
                    let piece = null;
                    if (i == 0) {
                        piece = new Piece(1, j + 1);
                    }
                    else if (i == 1) {
                        piece = new Piece(1, 0);
                    }
                    else if (i == 6) {
                        piece = new Piece(0, 0);
                    }
                    else if (i == 7) {
                        piece = new Piece(0, j + 1);
                    }
                    col.push(new Square((i + j) % 2, piece));
                }
                this.board.push(col);
            }
        }
    }

    getBoard = () => {
        return this.board;
    }

    isOnBoard = (row, col) => {
        return row >= 0 && row < 8 && col >= 0 && col < 8;
    }

    isOccupied = (row, col) => {
        return this.isOnBoard(row, col) && this.board[row][col].getPiece() !== null;
    }

    isNotOccupied = (row, col) => {
        return this.isOnBoard(row, col) && this.board[row][col].getPiece() === null;
    }

    underCheck = (color) => {
        let kingPos = null;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = this.board[i][j].getPiece();
                if (piece !== null && piece.isKing() && piece.color == color) {
                    kingPos = [i, j];
                    break;
                }
            }
            if (kingPos !== null) {
                break;
            }
        }
        let danger = false;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = this.board[i][j].getPiece();
                if (piece !== null && piece.color !== color) {
                    let moves = this.#getValidMovesHelper(i, j);
                    moves.forEach(move => {
                        if (move[0] == kingPos[0] && move[1] == kingPos[1]) {
                            danger = true;
                        }
                    })
                }
            }
        }
        return danger;
    }

    getDeadPieces = () => {
        return this.deadPieces;
    }

    copyGame = () => {
        let boardCopy = [];
        for(var i = 0; i < 8; i++) {
            let col = [];
            for (var j = 0; j < 8; j++) {
                col.push(this.board[i][j].getCopy());
            }
            boardCopy.push(col);
        }
        let deadPiecesCopy = [];
        this.deadPieces.forEach(deadPiece => {
            deadPiecesCopy.push(deadPiece.getCopy());
        });
        return new Game(this.turn, boardCopy, deadPiecesCopy);
    }

    getValidMoves = (row, col) => {
        if (this.board[row][col].getPiece().color !== this.turn) {
            return [];
        }
        else if (this.underCheck(this.turn)) {
            let allMoves = this.#getValidMovesHelper(row, col);
            let legalMoves = [];
            allMoves.forEach(move => {
                let gameCopy = this.copyGame();
                gameCopy.#forceMove(row, col, move[0], move[1]);
                if (!gameCopy.underCheck(this.turn)) {
                    legalMoves.push(move);
                }
            });
            if (this.board[row][col].getPiece().isKing()) {
                legalMoves = legalMoves.concat(this.getCastleMoves());
            }
            return legalMoves;
        }
        else {
            let allMoves = this.#getValidMovesHelper(row, col);
            let legalMoves = [];
            allMoves.forEach(move => {
                let gameCopy = this.copyGame();
                gameCopy.#forceMove(row, col, move[0], move[1]);
                if (!gameCopy.underCheck(this.turn)) {
                    legalMoves.push(move);
                }
            });
            if (this.board[row][col].getPiece().isKing()) {
                legalMoves = legalMoves.concat(this.getCastleMoves());
            }
            return legalMoves;
        }
    } 

    #getValidMovesHelper = (row, col) => {
        let moves = [];
        let piece = this.board[row][col].getPiece();
        if (piece.isRook() || piece.isQueen()) {
            for(let i = 1; i < 8; i++) {
                if(this.isNotOccupied(row, col + i)) {
                    moves.push([row, col + i]);
                }
                else {
                    if (this.isOccupied(row, col + i) && piece.isEnemy(this.board[row][col + i].getPiece())) {
                        moves.push([row, col + i]);
                    }
                    break;
                }
            }
            for(let i = 1; i < 8; i++) {
                if(this.isNotOccupied(row, col - i)){
                    moves.push([row, col - i]);
                }
                else {
                    if (this.isOccupied(row, col - i) && piece.isEnemy(this.board[row][col - i].getPiece())) {
                        moves.push([row, col - i]);
                    }
                    break;
                }
            }
            for(let i = 1; i < 8; i++) {
                if(this.isNotOccupied(row + i, col)){
                    moves.push([row + i, col]);
                }
                else {
                    if (this.isOccupied(row + i, col) && piece.isEnemy(this.board[row + i][col].getPiece())) {
                        moves.push([row + i, col]);
                    }
                    break;
                }
            }
            for(let i = 1; i < 8; i++) {
                if(this.isNotOccupied(row - i, col)){
                    moves.push([row - i, col]);
                }
                else {
                    if (this.isOccupied(row - i, col) && piece.isEnemy(this.board[row - i][col].getPiece())) {
                        moves.push([row - i, col]);
                    }
                    break;
                }
            }
        }
        if (piece.isKnight()) {
            if(
                this.isNotOccupied(row + 1, col + 2) 
            || (this.isOccupied(row + 1, col + 2) && piece.isEnemy(this.board[row + 1][col + 2].getPiece()))
            ) {
                moves.push([row + 1, col + 2]);
            }
            if(
                this.isNotOccupied(row + 1, col - 2) 
            || (this.isOccupied(row + 1, col - 2) && piece.isEnemy(this.board[row + 1][col - 2].getPiece()))
            ) {
                moves.push([row + 1, col - 2]);
            }
            if(
                this.isNotOccupied(row - 1, col + 2) 
            || (this.isOccupied(row - 1, col + 2) && piece.isEnemy(this.board[row - 1][col + 2].getPiece()))
            ) {
                moves.push([row - 1, col + 2]);
            }
            if(
                this.isNotOccupied(row - 1, col - 2) 
            || (this.isOccupied(row - 1, col - 2) && piece.isEnemy(this.board[row - 1][col - 2].getPiece()))
            ) {
                moves.push([row - 1, col - 2]);
            }
            if(
                this.isNotOccupied(row + 2, col + 1) 
            || (this.isOccupied(row + 2, col + 1) && piece.isEnemy(this.board[row + 2][col + 1].getPiece()))
            ) {
                moves.push([row + 2, col + 1]);
            }
            if(
                this.isNotOccupied(row + 2, col - 1) 
            || (this.isOccupied(row + 2, col - 1) && piece.isEnemy(this.board[row + 2][col - 1].getPiece()))
            ) {
                moves.push([row + 2, col - 1]);
            }
            if(
                this.isNotOccupied(row - 2, col + 1) 
            || (this.isOccupied(row - 2, col + 1) && piece.isEnemy(this.board[row - 2][col + 1].getPiece()))
            ) {
                moves.push([row - 2, col + 1]);
            }
            if(
                this.isNotOccupied(row - 2, col - 1) 
            || (this.isOccupied(row - 2, col - 1) && piece.isEnemy(this.board[row - 2][col - 1].getPiece()))
            ) {
                moves.push([row - 2, col - 1]);
            }
        }
        if (piece.isBishop() || piece.isQueen()) {
            let flag = false;
            for (let i = 1; i < 8; i++) {
                if(this.isNotOccupied(row + i, col + i)) {
                    moves.push([row + i, col + i]);
                    flag = true;
                }
                else if (this.isOnBoard(row + i, col + i)) {
                    if (piece.isEnemy(this.board[row + i][col + i].getPiece())) {
                        moves.push([row + i, col + i]);
                    }
                    break;
                }
                else if (flag){
                    break;
                }
            }
            flag = false;
            for (let i = 1; i < 8; i++) {
                if(this.isNotOccupied(row + i, col - i)) {
                    moves.push([row + i, col - i]);
                    flag = true;
                }
                else if (this.isOnBoard(row + i, col - i)) {
                    if (piece.isEnemy(this.board[row + i][col - i].getPiece())) {
                        moves.push([row + i, col - i]);
                    }
                    break;
                }
                else if (flag){
                    break;
                }
            }
            flag = false;
            for (let i = 1; i < 8; i++) {
                if(this.isNotOccupied(row - i, col + i)) {
                    moves.push([row - i, col + i]);
                    flag = true;
                }
                else if (this.isOnBoard(row - i, col + i)) {
                    if (piece.isEnemy(this.board[row - i][col + i].getPiece())) {
                        moves.push([row - i, col + i]);
                    }
                    break;
                }
                else if (flag){
                    break;
                }
            }
            flag = false;
            for (let i = 1; i < 8; i++) {
                if(this.isNotOccupied(row - i, col - i)) {
                    moves.push([row - i, col - i]);
                    flag = true;
                }
                else if (this.isOnBoard(row - i, col - i)) {
                    if (piece.isEnemy(this.board[row - i][col - i].getPiece())) {
                        moves.push([row - i, col - i]);
                    }
                    break;
                }
                else if (flag){
                    break;
                }
            }
        }
        if (piece.isKing()) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if(this.isNotOccupied(row + i, col + j)) {
                        moves.push([row + i, col + j]);
                    }
                    else if (this.isOccupied(row + i, col + j) && piece.isEnemy(this.board[row + i][col + j].getPiece())) {
                        moves.push([row + i, col + j]);
                    }
                } 
            }
        }
        if (piece.isPawn() && piece.isBlack()) {
            for(let i = 1; i <= (piece.moveCount == 0 ? 2 : 1); i++) {
                if (this.isOccupied(row + i, col)) {
                    break;
                }
                moves.push([row + i, col]);
            }
            if (this.isOccupied(row + 1, col + 1) && piece.isEnemy(this.board[row + 1][col + 1].getPiece())) {
                moves.push([row + 1, col + 1]);
            }
            if (this.isOccupied(row + 1, col - 1) && piece.isEnemy(this.board[row + 1][col - 1].getPiece())) {
                moves.push([row + 1, col - 1]);
            }
        }
        if (piece.isPawn() && piece.isWhite()) {
            for(let i = 1; i <= (piece.moveCount == 0 ? 2 : 1); i++) {
                if (this.isOccupied(row - i, col)) {
                    break;
                }
                moves.push([row - i, col]);
            }
            if (this.isOccupied(row - 1, col + 1) && piece.isEnemy(this.board[row - 1][col + 1].getPiece())) {
                moves.push([row - 1, col + 1]);
            }
            if (this.isOccupied(row - 1, col - 1) && piece.isEnemy(this.board[row - 1][col - 1].getPiece())) {
                moves.push([row - 1, col - 1]);
            }
        }
        return moves;
    }

    #isThreathened = (row, col) => {
        let danger = false;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = this.board[i][j].getPiece();
                if (piece !== null && piece.color !== this.turn) {
                    let moves = this.#getValidMovesHelper(i, j);
                    moves.forEach(move => {
                        if (move[0] == row && move[1] == col) {
                            danger = true;
                        }
                    })
                }
            }
        }
        return danger;
    }

    getCastleMoves = () => {
        let possibilities = this.isCastlePossible();
        let moves = []
        let kPos = 4;
        let side = this.turn === 0 ? 7 : 0;
        if (possibilities[0]) {
            moves.push([side, kPos - 2, 1]);
        }
        if (possibilities[1]) {
            moves.push([side, kPos + 2, 1]);
        }
        return moves;
    } 

    isCastlePossible = () => {
        let kPos = 4;
        let lRook = 0;
        let rRook = 7;
        let side = this.turn === 0 ? 7 : 0;
        let lr = this.board[side][lRook].getPiece();
        let rr = this.board[side][rRook].getPiece();
        let k = this.board[side][kPos].getPiece();
        if (k !== null && k.isKing() && k.moveCount == 0) {
            // check left 
            // Check for threaths in the king's path.
            let leftPossibility = !this.#isThreathened(side, kPos) && !this.#isThreathened(side, kPos - 1) && !this.#isThreathened(side, kPos-2);
            // Check if path is clear.
            leftPossibility = leftPossibility && this.board[side][kPos-1].getPiece() === null && this.board[side][kPos-2].getPiece() === null && this.board[side][kPos-3].getPiece() === null;
            // Check if rook is at the position and not moved yet.
            leftPossibility = leftPossibility && lr !== null && lr.isRook() && lr.moveCount === 0;
            // check right
            // Check for threaths in the king's path.
            let rightPossibility = !this.#isThreathened(side, kPos) && !this.#isThreathened(side, kPos + 1) && !this.#isThreathened(side, kPos + 2);
            // Check if path is clear.
            rightPossibility = rightPossibility && this.board[side][kPos+1].getPiece() === null && this.board[side][kPos+2].getPiece() === null;
            // Check if rook is at the position and not moved yet.
            rightPossibility = rightPossibility && rr !== null && rr.isRook() && rr.moveCount === 0;

            return [leftPossibility, rightPossibility];
        }
        return [false, false];
    }

    move = (rowf, colf, rowt, colt) => {
        let validMoves = this.getValidMoves(rowf, colf);
        let moved = false;
        // Special Case: Castling
        if (this.board[rowf][colf].getPiece().isKing()) {
            let castleMoves = this.getCastleMoves();
            castleMoves.forEach(move => {
                if (move[0] == rowt && move[1] == colt) {
                    this.board[rowt][colt].setPiece(this.board[rowf][colf].getPiece());
                    this.board[rowf][colf].removePiece();
                    if (colt == 6) {
                        this.board[rowt][5].setPiece(this.board[rowf][7].getPiece());
                        this.board[rowf][7].removePiece();
                    }
                    else {
                        this.board[rowt][3].setPiece(this.board[rowf][0].getPiece());
                        this.board[rowf][0].removePiece();
                    }
                    this.turn = this.turn == 0 ? 1 : 0;
                    moved = true;
                }
            });
        }
        if (!moved) {
            validMoves.forEach(move => {
                if (move[0] == rowt && move[1] == colt) {
                    this.board[rowf][colf].getPiece().moveCount++;
                    if (this.board[rowt][colt].getPiece() !== null) {
                        this.deadPieces.push(this.board[rowt][colt].getPiece());
                    }
                    this.board[rowt][colt].setPiece(this.board[rowf][colf].getPiece());
                    this.board[rowf][colf].removePiece();
                    if (this.board[rowt][colt].getPiece().isPawn()) {
                        if (rowt == 0 || rowt == 7) {
                            this.board[rowt][colt].getPiece().promote();
                        }
                    }
                    this.turn = this.turn == 0 ? 1 : 0;
                    moved = true;
                }
            });
        }
        return moved;
    }
    
    #forceMove = (rowf, colf, rowt, colt) => {
        this.board[rowf][colf].getPiece().moveCount++;
        if (this.board[rowt][colt].getPiece() !== null) {
            this.deadPieces.push(this.board[rowt][colt].getPiece());
        }
        this.board[rowt][colt].setPiece(this.board[rowf][colf].getPiece());
        this.board[rowf][colf].removePiece();
        if (this.board[rowt][colt].getPiece().isPawn()) {
            if (rowt == 0 || rowt == 7) {
                this.board[rowt][colt].getPiece().promote();
            }
        }
        this.turn = this.turn == 0 ? 1 : 0;
    }

    isGameOver = () => {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let piece = this.board[i][j].getPiece();
                if (piece !== null && piece.color === this.turn) {
                    let moves = this.getValidMoves(i, j);
                    if (moves.length > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    
}

class Piece {

    constructor(color, type){
        this.moveCount = 0;
        this.color = color;
        this.type = type;
        if (type == 0) {
            this.type = 0; //pawn
        }
        else if (type == 1 || type == 8) {
            this.type = 1; //rook
        }
        else if (type == 2 || type == 7) {
            this.type = 2; //knight
        }
        else if (type == 3 || type == 6) {
            this.type = 3; //bishop
        }
        else if (type == 4) {
            this.type = 4; //queen
        }
        else if (type == 5) {
            this.type = 5; //king
        }
    }

    getCopy = () => {
        return new Piece(this.color, this.type);
    }

    promote = () => {
        this.type = 4; //promote to queen
    }

    isPawn = () => {
        return this.type === 0;
    }

    isKnight = () => {
        return this.type === 2;
    }

    isBishop = () => {
        return this.type === 3;
    }

    isRook = () => {
        return this.type === 1;
    }

    isQueen = () => {
        return this.type === 4;
    }

    isKing = () => {
        return this.type === 5;
    }

    isWhite = () => {
        return this.color === 0;
    }

    isBlack = () => {
        return this.color === 1;
    }

    isEnemy = (that) => {
        return that.color !== this.color;
    }
}

class Square {

    constructor (color, piece) {
        this.color = color;
        this.piece = piece;
    }

    getCopy = () => {
        return new Square(this.color, this.piece === null ? null : this.piece.getCopy());
    }

    isWhite = () => {
        return this.color === 0;
    }

    isBlack = () => {
        return this.color === 1;
    }

    getPiece = () => {
        return this.piece;
    }

    setPiece = (piece) => {
        this.piece = piece;
    }

    removePiece  = (piece) => {
        this.piece = null;
    }
}

module.exports = Game