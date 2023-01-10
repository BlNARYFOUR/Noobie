class PieceType extends Enum {
    static #index = 0;

    static EMPTY = new PieceType();
    static PAWN = new PieceType();
    static ROOK = new PieceType();
    static KNIGHT = new PieceType();
    static BISHOP = new PieceType();
    static KING = new PieceType();
    static QUEEN = new PieceType();

    constructor() {
        super(++PieceType.#index);
    }
}
