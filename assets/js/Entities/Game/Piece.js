class Piece {
    constructor(type = PieceType.EMPTY, color = null) {
        this.color = color;
        this.type = type;
        this.moveCount = 0;

        if (type !== PieceType.EMPTY && color === null) {
            throw new Error('Color must be set if the piece type does not equal [PIECES.EMPTY]!');
        }
    }
}
