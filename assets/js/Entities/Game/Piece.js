class Piece {
    constructor(type = PieceType.EMPTY, color = null, moveCount = 0) {
        this.color = color;
        this.type = type;
        this.moveCount = moveCount;

        if (type !== PieceType.EMPTY && color === null) {
            throw new Error('Color must be set if the piece type does not equal [PIECES.EMPTY]!');
        }
    }

    equals(piece) {
        return this.color === piece.color && this.type === piece.type;
    }
}
