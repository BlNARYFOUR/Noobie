class PieceTypeEvaluation {
    static get PIECE_TYPE_EVALUATIONS() {
        const EVALUATIONS = [];
        EVALUATIONS[PieceType.EMPTY] = 0;
        EVALUATIONS[PieceType.PAWN] = 1;
        EVALUATIONS[PieceType.ROOK] = 5;
        EVALUATIONS[PieceType.KNIGHT] = 3;
        EVALUATIONS[PieceType.BISHOP] = 3.5;
        EVALUATIONS[PieceType.KING] = 0;
        EVALUATIONS[PieceType.QUEEN] = 9;

        return EVALUATIONS;
    }

    static getPieceTypeEvaluation(pieceType) {
        return PieceTypeEvaluation.PIECE_TYPE_EVALUATIONS[pieceType];
    }

    static getPieceEvaluation(piece) {
        return PieceTypeEvaluation.getPieceTypeEvaluation(piece.type);
    }
}
