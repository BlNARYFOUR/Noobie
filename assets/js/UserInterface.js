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

    showBoard(index) {
        const BOARDS_ELEMENT = document.querySelector('#boards');
        let boardHTML = `<li id="board-${index}-wrapper"><ul id="board-${index}" class="chess-board">`, squareColor = Color.WHITE;

        this.boards[index].setup.forEach((column, x) => {
            boardHTML += `<li data-board-id="${index}"><ul data-board-id="${index}" class="chess-column">`;

            column.forEach((piece, y) => {
                boardHTML += `<li data-board-id="${index}" data-x="${x}" data-y="${y}" class="chess-square bg-${squareColor} chess-piece chess-piece-${this.pieceTypeToString(piece)}-${piece.color}"></li>`;

                squareColor = squareColor === Color.WHITE ? Color.BLACK : Color.WHITE;
            });

            squareColor = squareColor === Color.WHITE ? Color.BLACK : Color.WHITE;

            boardHTML += '</ul></li>';
        });

        boardHTML += '</ul></li>';

        BOARDS_ELEMENT.innerHTML += boardHTML;

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

                rtStr += '%c' + this.pieceTypeToChar(piece) + ' ';
            });

            rtStr += '\n';
        });

        console.log(rtStr, ...colorArr);

        return this;
    }

    pieceTypeToChar(piece) {
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

    pieceTypeToString(piece) {
        switch (piece.type) {
            case PieceType.EMPTY:
                return 'empty';
            case PieceType.PAWN:
                return 'pawn';
            case PieceType.ROOK:
                return 'rook';
            case PieceType.KNIGHT:
                return 'knight';
            case PieceType.QUEEN:
                return 'queen';
            case PieceType.BISHOP:
                return 'bishop';
            case PieceType.KING:
                return 'king';
        }
    }
}
