class Board {
    static get DEFAULT_BOARD_SETUP() {
        return [
            [new Piece(PieceType.ROOK, Color.BLACK), new Piece(PieceType.KNIGHT, Color.BLACK), new Piece(PieceType.BISHOP, Color.BLACK), new Piece(PieceType.QUEEN, Color.BLACK), new Piece(PieceType.KING, Color.BLACK), new Piece(PieceType.BISHOP, Color.BLACK), new Piece(PieceType.KNIGHT, Color.BLACK), new Piece(PieceType.ROOK, Color.BLACK)],
            [new Piece(PieceType.PAWN, Color.BLACK), new Piece(PieceType.PAWN, Color.BLACK), new Piece(PieceType.PAWN, Color.BLACK), new Piece(PieceType.PAWN, Color.BLACK), new Piece(PieceType.PAWN, Color.BLACK), new Piece(PieceType.PAWN, Color.BLACK), new Piece(PieceType.PAWN, Color.BLACK), new Piece(PieceType.PAWN, Color.BLACK)],
            [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
            [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
            [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
            [new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece(), new Piece()],
            [new Piece(PieceType.PAWN, Color.WHITE), new Piece(PieceType.PAWN, Color.WHITE), new Piece(PieceType.PAWN, Color.WHITE), new Piece(PieceType.PAWN, Color.WHITE), new Piece(PieceType.PAWN, Color.WHITE), new Piece(PieceType.PAWN, Color.WHITE), new Piece(PieceType.PAWN, Color.WHITE), new Piece(PieceType.PAWN, Color.WHITE)],
            [new Piece(PieceType.ROOK, Color.WHITE), new Piece(PieceType.KNIGHT, Color.WHITE), new Piece(PieceType.BISHOP, Color.WHITE), new Piece(PieceType.QUEEN, Color.WHITE), new Piece(PieceType.KING, Color.WHITE), new Piece(PieceType.BISHOP, Color.WHITE), new Piece(PieceType.KNIGHT, Color.WHITE), new Piece(PieceType.ROOK, Color.WHITE)],
        ];
    }

    get previousMove() {
        return (0 < this.moveHistory.length) ? this.moveHistory[this.moveHistory.length - 1] : (new Move());
    }

    constructor(id, setup = null, turn = Color.WHITE, moveHistory = []) {
        this.id = id;
        this.setup = setup;
        this.turn = turn;
        this.moveHistory = moveHistory;
    }

    createDefaultSetup() {
        this.setup = Helper.deepCopy(Board.DEFAULT_BOARD_SETUP);
        return this;
    }

    getPiece(coordinates) {
        return this.setup[coordinates.x][coordinates.y];
    }

    findKingCoordinates(color) {
        for(let x = 0; x < 8; x++) {
            for(let y = 0; y < 8; y++) {
                const COORDINATES = new Coordinates(x, y)
                const PIECE = this.getPiece(COORDINATES);

                if (PIECE.type === PieceType.KING && PIECE.color === color) {
                    return COORDINATES;
                }
            }
        }

        return Coordinates.INVALID;
    }

    doMove(move) {
        if (Rules.isEnPassant(this, move)) {
            this.setup[move.position.x][move.newPosition.y] = new Piece();
        } else if (Rules.isShortCastle(this, move)) {
            this.setup[move.newPosition.x][move.newPosition.y + 1] = new Piece();
            this.setup[move.newPosition.x][move.newPosition.y - 1] = new Piece(PieceType.ROOK, this.turn);
        } else if (Rules.isLongCastle(this, move)) {
            this.setup[move.newPosition.x][move.newPosition.y - 2] = new Piece();
            this.setup[move.newPosition.x][move.newPosition.y + 1] = new Piece(PieceType.ROOK, this.turn);
        }

        this.getPiece(move.position).moveCount++;
        this.setup[move.newPosition.x][move.newPosition.y] = this.setup[move.position.x][move.position.y];
        this.setup[move.position.x][move.position.y] = new Piece();

        return this;
    }

    switchTurn() {
        this.turn = this.turn === Color.WHITE ? Color.BLACK : Color.WHITE;

        return this;
    }

    pushToMoveHistory(move) {
        this.moveHistory.push(move);

        return this;
    }

    doMoveIfLegal(move) {
        const isLegal = Rules.isLegalMove(this, move);

        if(isLegal) {
            this.doMove(move).switchTurn().pushToMoveHistory(move);

            return true;
        }

        console.warn('Illegal move...');

        return false;
    }
}
