const BOARDS = [];

function createDefaultBoard() {
    const BOARD = BoardFactory.createDefaultInstance();

    BOARDS[BOARD.id] = BOARD;
}

function removeBoard(boardArr, board) {
    return (delete boardArr[board.id]);
}

function addHTMLBoard() {
    // todo
}

function printBoard(board) {
    let rtStr = '';
    let colorArr = [];

    board.setup.forEach(column => {
        column.forEach(piece => {
            if (piece.color === Color.WHITE) {
                colorArr.push('color:white;');
            } else if (piece.color === Color.BLACK) {
                colorArr.push('color:darkgrey;');
            } else {
                colorArr.push('color:rgba(0,0,0,0.5);');
            }

            rtStr += '%c' + pieceTypeToLetter(piece) + ' ';
        });

        rtStr += '\n';
    });

    console.log(rtStr, ...colorArr);
}

function pieceTypeToLetter(piece) {
    switch (piece.type) {
        case PieceType.EMPTY:      return 'X';
        case PieceType.PAWN:       return 'P';
        case PieceType.ROOK:       return 'R';
        case PieceType.KNIGHT:     return 'N';
        case PieceType.QUEEN:      return 'Q';
        case PieceType.BISHOP:     return 'B';
        case PieceType.KING:       return 'K';
    }
}
