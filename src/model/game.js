import Piece from './piece.js';
import Square from './square.js'

class Game {

    constructor() {
        this.turn = 0;
        this.board = [];
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

    underCheck = () => {
        let kingPos = null;
        for (let i = 0; i <= 8; i++) {
            for (let j = 0; j <= 8; j++) {
                let piece = this.board[i][j];
                if (piece !== null && piece.isKing() && piece.color == this.turn) {
                    kingPos = [i, j];
                    break;
                }
            }
            if (kingPos !== null) {
                break;
            }
        }
        for (let i = 0; i <= 8; i++) {
            for (let j = 0; j <= 8; j++) {
                let piece = this.board[i][j];
                if (piece !== null && piece.color !== this.turn) {
                    let moves = this.getValidMoves(i, j);
                    moves.forEach(move => {
                        if (move[0] == kingPos[0] && move[1] == kingPos[1]) {
                            return true;
                        }
                    })
                }
            }
        }
        return false;
    }

    getValidMoves = (row, col) => {
        let moves = [];
        let piece = this.board[row][col].getPiece();
        if (piece.color !== this.turn) {
            return moves;
        }
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

    move = (rowf, colf, rowt, colt) => {
        let validMoves = this.getValidMoves(rowf, colf);
        validMoves.forEach(move => {
            if (move[0] == rowt && move[1] == colt) {
                this.board[rowf][colf].getPiece().moveCount++;
                this.board[rowt][colt].setPiece(this.board[rowf][colf].getPiece());
                this.board[rowf][colf].removePiece();
                if (this.board[rowt][colt].getPiece().isPawn()) {
                    if (rowt == 0 || rowt == 7) {
                        this.board[rowt][colt].getPiece().promote();
                    }
                }
                this.turn = this.turn == 0 ? 1 : 0;
            }
        })
    } 
    
}

export default Game;