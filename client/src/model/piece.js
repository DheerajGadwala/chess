class Piece {

    constructor(color, type, moveCount){
        this.moveCount = moveCount;
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

export default Piece;