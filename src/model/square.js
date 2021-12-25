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

export default Square;