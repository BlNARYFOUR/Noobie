// todo: split this file in multiple files

class Helper {
    static deepCopy = function (object) {
        return JSON.parse(JSON.stringify(object));
    };
}

const PieceType = {
    EMPTY:  0,
    PAWN:   1,
    ROOK:   2,
    KNIGHT: 3,
    BISHOP: 4,
    KING:   5,
    QUEEN:  6
};

const Color = {
    BLACK: 'black',
    WHITE: 'white'
};

const PIECE_EVALUATIONS = [];
PIECE_EVALUATIONS[PieceType.EMPTY] = 0;
PIECE_EVALUATIONS[PieceType.PAWN] = 1;
PIECE_EVALUATIONS[PieceType.ROOK] = 5;
PIECE_EVALUATIONS[PieceType.KNIGHT] = 3;
PIECE_EVALUATIONS[PieceType.BISHOP] = 3.5;
PIECE_EVALUATIONS[PieceType.KING] = 0;
PIECE_EVALUATIONS[PieceType.QUEEN] = 9;

class Coordinates {
    static get INVALID() {
        return new Coordinates();
    }

    constructor(x = -1, y = -1) {
        this.x = x;
        this.y = y;
    }

    equals(coordinates) {
        return this.x === coordinates.x && this.y === coordinates.y;
    }

    isInvalid() {
        return this.x < 0 || 7 < this.x || this.y < 0 || 7 < this.y;
    }
}

class Move {
    static get INVALID() {
        return new Move();
    }

    constructor(coordinates = Coordinates.INVALID, newCoordinates = Coordinates.INVALID) {
        this.position = coordinates;
        this.newPosition = newCoordinates;
    }

    equals(move) {
        return this.position.equals(move.position) && this.newPosition.equals(move.newPosition);
    }

    isInvalid() {
        return this.position.isInvalid() || this.newPosition.isInvalid();
    }
}

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

    constructor(id, setup = null, turn = Color.WHITE, previousMove = new Move()) {
        this.id = id;
        this.setup = setup;
        this.turn = turn;
        this.previousMove = previousMove;
    }

    createDefaultSetup() {
        this.setup = Helper.deepCopy(Board.DEFAULT_BOARD_SETUP);
        return this;
    }

    getPiece(coordinates) {
        return this.setup[coordinates.x][coordinates.y];
    }

    findKingCoordinates(color) {
        this.setup.forEach((column, x) => {
            column.forEach((piece, y) => {
                if (piece.type === PieceType.KING && piece.color === color) {
                    return new Coordinates(x, y);
                }
            });
        });

        return Coordinates.INVALID;
    }

    doMove(move) {
        if(Rules.isEnPassant(this, move)) {
            console.log(move.position.x, move.newPosition.y);
            this.setup[move.position.x][move.newPosition.y] = new Piece();
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

    setPreviousMove(move) {
        this.previousMove = move;

        return this;
    }

    doMoveIfLegal(move) {
        const isLegal = Rules.isLegalMove(this, move);

        if(isLegal) {
            this.doMove(move).switchTurn().setPreviousMove(move);

            return true;
        }

        console.warn('Illegal move...');

        return false;
    }
}

const BoardFactory = (function () {
    let nextId = 0;

    function createInstance(setup = null, turn = Color.WHITE) {
        return new Board(nextId++, setup, turn);
    }

    function createDefaultInstance() {
        return createInstance().createDefaultSetup();
    }

    return {
        createInstance: createInstance,
        createDefaultInstance: createDefaultInstance
    }
})();
