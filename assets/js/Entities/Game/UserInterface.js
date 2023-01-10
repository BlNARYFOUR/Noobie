class UserInterface {
    constructor() {
        this.boards = [];
        this.pieceSelected = false;
        this.selectedPieceCoordinates = Coordinates.INVALID;
        this.possibleMovesForSelectedPiece = [];
    }

    createDefaultBoard() {
        const BOARD = BoardFactory.getInstance().createDefaultBoard();
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

        const PIECE_ELEMENTS = BOARDS_ELEMENT.querySelectorAll('.chess-piece');

        PIECE_ELEMENTS.forEach(PIECE_ELEMENT => {
            PIECE_ELEMENT.addEventListener('click', (e) => UserInterface.onClickPieceHTML(e, this));
        });

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

    makeHtmlMove(board, move) {
        const PIECE = board.getPiece(move.position);
        const OLD_PIECE = board.getPiece(move.newPosition);
        const EMPTY_PIECE = new Piece();

        const IS_EN_PASSANT = Rules.isEnPassant(board, move);
        const IS_SHORT_CASTLE = Rules.isShortCastle(board, move);
        const IS_LONG_CASTLE = Rules.isLongCastle(board, move);

        const HAS_MOVED = board.doMoveIfLegal(move);

        if(HAS_MOVED) {
            document.querySelectorAll(`[data-board-id='${board.id}'].chess-square.highlight-yellow`).forEach(element => {
                element.classList.remove('highlight-yellow');
            });

            document.querySelectorAll(`[data-board-id='${board.id}'].chess-square.possible-move`).forEach(element => {
                element.classList.remove('possible-move');
            });

            const GOTO_SQUARE = document.querySelector(`[data-board-id='${board.id}'][data-x='${move.newPosition.x}'][data-y='${move.newPosition.y}']`);
            const FROM_SQUARE = document.querySelector(`[data-board-id='${board.id}'][data-x='${move.position.x}'][data-y='${move.position.y}']`);

            GOTO_SQUARE.classList.remove(`chess-piece-${this.pieceTypeToString(OLD_PIECE)}-${OLD_PIECE.color}`);
            GOTO_SQUARE.classList.add(`chess-piece-${this.pieceTypeToString(PIECE)}-${PIECE.color}`);
            FROM_SQUARE.classList.remove(`chess-piece-${this.pieceTypeToString(PIECE)}-${PIECE.color}`);
            FROM_SQUARE.classList.add(`chess-piece-${this.pieceTypeToString(EMPTY_PIECE)}-${EMPTY_PIECE.color}`);

            if (IS_EN_PASSANT) {
                const CAPTURE = document.querySelector(`[data-board-id='${board.id}'][data-x='${move.position.x}'][data-y='${move.newPosition.y}']`);
                CAPTURE.classList.remove(`chess-piece-${this.pieceTypeToString(PIECE)}-${PIECE.color}`);
                CAPTURE.classList.add(`chess-piece-${this.pieceTypeToString(EMPTY_PIECE)}-${EMPTY_PIECE.color}`);
            } else if (IS_SHORT_CASTLE) {
                const OLD_ROOK = document.querySelector(`[data-board-id='${board.id}'][data-x='${move.newPosition.x}'][data-y='${move.newPosition.y + 1}']`);
                const NEW_ROOK = document.querySelector(`[data-board-id='${board.id}'][data-x='${move.newPosition.x}'][data-y='${move.newPosition.y - 1}']`);
                this.showHtmlCastleRookMove(OLD_ROOK, NEW_ROOK, PIECE.color);
            } else if (IS_LONG_CASTLE) {
                const OLD_ROOK = document.querySelector(`[data-board-id='${board.id}'][data-x='${move.newPosition.x}'][data-y='${move.newPosition.y - 2}']`);
                const NEW_ROOK = document.querySelector(`[data-board-id='${board.id}'][data-x='${move.newPosition.x}'][data-y='${move.newPosition.y + 1}']`);
                this.showHtmlCastleRookMove(OLD_ROOK, NEW_ROOK, PIECE.color);
            }
        }

        this.pieceSelected = false;
        this.selectedPieceCoordinates = Coordinates.INVALID;
        this.possibleMovesForSelectedPiece = [];
    }

    showHtmlCastleRookMove(oldRookElement, newRookElement, color) {
        const EMPTY_PIECE = new Piece();
        const ROOK = new Piece(PieceType.ROOK, color);

        oldRookElement.classList.remove(`chess-piece-${this.pieceTypeToString(ROOK)}-${ROOK.color}`);
        oldRookElement.classList.add(`chess-piece-${this.pieceTypeToString(EMPTY_PIECE)}-${EMPTY_PIECE.color}`);
        newRookElement.classList.remove(`chess-piece-${this.pieceTypeToString(EMPTY_PIECE)}-${EMPTY_PIECE.color}`);
        newRookElement.classList.add(`chess-piece-${this.pieceTypeToString(ROOK)}-${ROOK.color}`);
    }

    showHtmlPossibleMoves(board, currentCoordinates, possibleMoves) {
        document.querySelectorAll(`[data-board-id='${board.id}'].chess-square.highlight-yellow`).forEach(element => {
            element.classList.remove('highlight-yellow');
        });

        if(this.selectedPieceCoordinates.equals(currentCoordinates)) {
            this.pieceSelected = !this.pieceSelected;
        } else {
            document.querySelectorAll(`[data-board-id='${board.id}'].chess-square.possible-move`).forEach(element => {
                element.classList.remove('possible-move');
            });

            if(0 < possibleMoves.length) {
                this.pieceSelected = true;
                document.querySelector(`[data-board-id='${board.id}'][data-x='${currentCoordinates.x}'][data-y='${currentCoordinates.y}']`).classList.add('highlight-yellow');
            } else {
                this.pieceSelected = false;
            }
        }

        if(this.pieceSelected) {
            this.selectedPieceCoordinates = currentCoordinates;
            this.possibleMovesForSelectedPiece = possibleMoves;
        } else {
            this.selectedPieceCoordinates = Coordinates.INVALID;
            this.possibleMovesForSelectedPiece = [];
        }

        possibleMoves.forEach(possibleMove => {
            document.querySelector(`[data-board-id='${board.id}'][data-x='${possibleMove.newPosition.x}'][data-y='${possibleMove.newPosition.y}']`).classList.toggle('possible-move');
        });
    }

    static onClickPieceHTML(e, ui) {
        if(e) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }

        const ELEMENT = e.target;
        const BOARD = ui.boards[ELEMENT.dataset.boardId];
        const COORDINATES = new Coordinates(parseInt(ELEMENT.dataset.x), parseInt(ELEMENT.dataset.y));
        const POSSIBLE_MOVES = Rules.getLegalMoves(BOARD, COORDINATES);
        const SELECTED_MOVE = new Move(ui.selectedPieceCoordinates, COORDINATES);

        if(
            ui.pieceSelected
            && 0 < ui.possibleMovesForSelectedPiece.filter((possibleMove) => {
                return possibleMove.equals(SELECTED_MOVE);
            }).length
        ) {
            ui.makeHtmlMove(BOARD, SELECTED_MOVE);
        } else {
            ui.showHtmlPossibleMoves(BOARD, COORDINATES, POSSIBLE_MOVES);
        }
    }
}