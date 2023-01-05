class UserInterface {
    constructor() {
        this.boards = [];
    }

    createDefaultBoard() {
        const BOARD = BoardFactory.createDefaultInstance();
        this.boards[BOARD.id] = BOARD;

        return BOARD.id;
    }

    removeBoard(boardArr, board) {
        delete boardArr[board.id];

        return this;
    }

    addHTMLBoard() {
        // todo

        return this;
    }

    printBoard(index) {
        let rtStr = '';
        let colorArr = [];

        this.boards[index].setup.forEach(column => {
            column.forEach(piece => {
                if (piece.color === Color.WHITE) {
                    colorArr.push('color:white;');
                } else if (piece.color === Color.BLACK) {
                    colorArr.push('color:darkgrey;');
                } else {
                    colorArr.push('color:rgba(0,0,0,0.5);');
                }

                rtStr += '%c' + this.pieceTypeToLetter(piece) + ' ';
            });

            rtStr += '\n';
        });

        console.log(rtStr, ...colorArr);
    }

    pieceTypeToLetter(piece) {
        switch (piece.type) {
            case PieceType.EMPTY:
                return 'X';
            case PieceType.PAWN:
                return 'P';
            case PieceType.ROOK:
                return 'R';
            case PieceType.KNIGHT:
                return 'N';
            case PieceType.QUEEN:
                return 'Q';
            case PieceType.BISHOP:
                return 'B';
            case PieceType.KING:
                return 'K';
        }
    }
}
