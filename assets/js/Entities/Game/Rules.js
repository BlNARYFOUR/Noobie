class Rules {
    static isLegalMove(board, move) {
        return Rules.isLegalMoveByPieceType(board, move)
            && !Rules.doesMoveResultInCheck(board, move, board.turn);
    }

    static getLegalMoves(board, coordinates) {
        const POSSIBLE_MOVES = Rules.getPossibleMovesByPieceType(board, coordinates);
        const LEGAL_MOVES = [];

        POSSIBLE_MOVES.forEach(possibleMove => {
            if (Rules.isLegalMove(board, possibleMove)) {
                LEGAL_MOVES.push(possibleMove);
            }
        });

        return LEGAL_MOVES;
    }

    static getAllLegalMoves(board) {
        const LEGAL_MOVES = [];

        board.setup.forEach((column, x) => {
            column.forEach((piece, y) => {
                LEGAL_MOVES.push(...Rules.getLegalMoves(board, new Coordinates(x, y)));
            });
        });

        return LEGAL_MOVES;
    }

    static getPossibleMovesByPieceType(board, coordinates) {
        switch (board.getPiece(coordinates).type) {
            case PieceType.EMPTY:
                return [];
            case PieceType.PAWN:
                return Rules.getPossiblePawnMoves(coordinates);
            case PieceType.ROOK:
                return Rules.getPossibleRookMoves(coordinates);
            case PieceType.KNIGHT:
                return Rules.getPossibleKnightMoves(coordinates);
            case PieceType.BISHOP:
                return Rules.getPossibleBishopMoves(coordinates);
            case PieceType.QUEEN:
                return Rules.getPossibleQueenMoves(coordinates);
            case PieceType.KING:
                return Rules.getPossibleKingMoves(coordinates);
            default:
                return [];
        }
    }

    static isLegalMoveByPieceType(board, move, color = null, includePromotions = true) {
        if (
            move.isInvalid()
            || !Rules.isFriendlyPiece(board, move.position, color)
            || Rules.isMoveToFriendlyField(board, move)
            || (move.position.x === move.newPosition.x && move.position.y === move.newPosition.y)
        ) {
            return false;
        }

        switch (board.getPiece(move.position).type) {
            case PieceType.EMPTY:
                return false;
            case PieceType.PAWN:
                return Rules.isLegalPawnMove(board, move, includePromotions);
            case PieceType.ROOK:
                return Rules.isLegalRookMove(board, move);
            case PieceType.KNIGHT:
                return Rules.isLegalKnightMove(board, move);
            case PieceType.BISHOP:
                return Rules.isLegalBishopMove(board, move);
            case PieceType.QUEEN:
                return Rules.isLegalQueenMove(board, move);
            case PieceType.KING:
                return Rules.isLegalKingMove(board, move);
            default:
                return true;
        }
    }

    static isFriendlyPiece(board, coordinates, color = null) {
        if(color === null) {
            color = board.turn;
        }

        return board.getPiece(coordinates).color === color;
    }

    static isMoveToFriendlyField(board, move) {
        const PIECE = board.getPiece(move.position);
        const NEW_PIECE = board.getPiece(move.newPosition);

        return NEW_PIECE.type !== PieceType.EMPTY && PIECE.color === NEW_PIECE.color;
    }

    static doesMoveResultInCheck(board, move, color) {
        const NEW_BOARD = BoardFactory.getInstance().createBoard(board.setup, board.turn, board.moveHistory);
        NEW_BOARD.play(move);

        return Rules.isCheck(NEW_BOARD, color);
    }

    static isCheck(board, color) {
        const KING_COORDINATES = board.findKingCoordinates(color);
        let isCheck = false;

        if (KING_COORDINATES.isInvalid()) {
            return false;
        }

        board.setup.forEach((column, x) => {
            column.forEach((piece, y) => {
                if(Rules.isLegalMoveByPieceType(
                    board,
                    new Move(new Coordinates(x, y), KING_COORDINATES),
                    (color === Color.WHITE ? Color.BLACK : Color.WHITE),
                    false
                )) {
                    isCheck = true;
                }
            });
        });

        return isCheck;
    }

    static isNoMovePossible(board) {
        for(let x = 0; x < board.setup.length; x++) {
            for(let y = 0; y < board.setup[x].length; y++) {
                if(0 < Rules.getLegalMoves(board, new Coordinates(x, y)).length) {
                    return false;
                }
            }
        }

        return true;
    }

    static isCheckMate(board) {
        return this.isCheck(board, board.turn) && this.isNoMovePossible(board);
    }

    static isStaleMate(board) {
        return !this.isCheck(board, board.turn) && this.isNoMovePossible(board);
    }

    static isThreefoldRepetitionDraw(board) {
        const BOARD_STATE_OCCURRENCE_COUNT = board.boardHistory.countBoardStateOccurrence(board);

        return 3 <= BOARD_STATE_OCCURRENCE_COUNT;
    }

    static isFiftyMoveRuleDraw(board) {
        let moveCounter = 0;

        for (let index = board.boardHistory.history.length - 2; 0 <= index; index--) {
            const HISTORIC_MOVE = board.moveHistory[index];
            const HISTORIC_BOARD = board.boardHistory.history[index];

            if (HISTORIC_BOARD.getPiece(HISTORIC_MOVE.position).type === PieceType.PAWN) {
                return false;
            }

            if (HISTORIC_BOARD.getPiece(HISTORIC_MOVE.newPosition).type !== PieceType.EMPTY) {
                return false;
            }

            moveCounter++;

            if (moveCounter === 100) {
                return true;
            }
        }

        return false;
    }

    static isInsufficientMaterialDraw(board) {
        const PIECES = [];
        PIECES[Color.WHITE] = [];
        PIECES[Color.BLACK] = [];
        let isInsufficientMaterial = false;

        // get all pieces

        board.setup.forEach((column, x) => {
            column.forEach((piece, y) => {
                if(piece.type !== PieceType.EMPTY) {
                    PIECES[piece.color].push({
                        type: piece.type,
                        coordinates: new Coordinates(x, y)
                    });
                }
            });
        });

        let mostLengthColor, leastLengthColor;
        if(PIECES[Color.WHITE].length < PIECES[Color.BLACK].length) {
            mostLengthColor = Color.BLACK;
            leastLengthColor = Color.WHITE;
        } else {
            mostLengthColor = Color.WHITE;
            leastLengthColor = Color.BLACK;
        }

        // king vs king
        if (
            PIECES[mostLengthColor].length === 1
            && PIECES[leastLengthColor].length === 1
        ) {
            isInsufficientMaterial = true;
        }

        // king and bishop vs king
        // king and knight vs king
        if (
            PIECES[mostLengthColor].length === 2
            && PIECES[leastLengthColor].length === 1
            && 0 < PIECES[mostLengthColor].filter(piece => {
                return piece.type === PieceType.BISHOP
                || piece.type === PieceType.KNIGHT;
            }).length
        ) {
            isInsufficientMaterial = true;
        }

        const BISHOP_PIECE_RES_MOST = PIECES[mostLengthColor].filter(piece => {
            return piece.type === PieceType.BISHOP;
        });

        const BISHOP_PIECE_RES_LEAST = PIECES[leastLengthColor].filter(piece => {
            return piece.type === PieceType.BISHOP;
        });

        // king and bishop vs king and bishop of the same coloured square
        if (
            PIECES[mostLengthColor].length === 2
            && PIECES[leastLengthColor].length === 2
            && 0 < BISHOP_PIECE_RES_MOST.length
            && 0 < BISHOP_PIECE_RES_LEAST.length
        ) {
            // test if bishops are on same square color:
            // bishops diagonal color can be calculated with "squareColor = (x + y) % 2 ? Color.WHITE : Color.BLACK"
            let squareColorMost, squareColorLeast;

            BISHOP_PIECE_RES_MOST.forEach(bishopPiece => {
                squareColorMost = (bishopPiece.coordinates.x + bishopPiece.coordinates.y) % 2;
            });

            BISHOP_PIECE_RES_LEAST.forEach(bishopPiece => {
                squareColorLeast = (bishopPiece.coordinates.x + bishopPiece.coordinates.y) % 2;
            });

            if (squareColorMost === squareColorLeast) {
                isInsufficientMaterial = true;
            }
        }

        return isInsufficientMaterial;
    }

    static getGameState(board) {
        if (Rules.isCheckMate(board)) {
            if(board.turn === Color.WHITE) {
                return GameState.CHECKMATE_BLACK;
            } else {
                return GameState.CHECKMATE_WHITE;
            }
        } else if (Rules.isStaleMate(board)) {
            return GameState.DRAW_STALEMATE;
        } else if (Rules.isThreefoldRepetitionDraw(board)) {
            return GameState.DRAW_THREEFOLD_REPETITION;
        } else if (Rules.isInsufficientMaterialDraw(board)) {
            return GameState.DRAW_INSUFFICIENT_MATERIAL;
        } else if (Rules.isFiftyMoveRuleDraw(board)) {
            return GameState.DRAW_FIFTY_MOVE_RULE;
        }

        return GameState.ONGOING;
    }

    static getPossiblePawnMoves(coordinates) {
        const POSSIBLE_MOVES = [
            new Move(coordinates, new Coordinates(coordinates.x - 1, coordinates.y + 0)),   // 1 up
            new Move(coordinates, new Coordinates(coordinates.x - 2, coordinates.y + 0)),   // 2 up
            new Move(coordinates, new Coordinates(coordinates.x - 1, coordinates.y - 1)),   // 1 up, 1 left
            new Move(coordinates, new Coordinates(coordinates.x - 1, coordinates.y + 1)),   // 1 up, 1 right
            new Move(coordinates, new Coordinates(coordinates.x + 1, coordinates.y + 0)),   // 1 down
            new Move(coordinates, new Coordinates(coordinates.x + 2, coordinates.y + 0)),   // 2 down
            new Move(coordinates, new Coordinates(coordinates.x + 1, coordinates.y - 1)),   // 1 down, 1 left
            new Move(coordinates, new Coordinates(coordinates.x + 1, coordinates.y + 1)),   // 1 down, 1 right
        ];

        Rules.getPossiblePawnPromotions().forEach(promotion => {
            POSSIBLE_MOVES.push(new Move(coordinates, new Coordinates(coordinates.x - 1, coordinates.y + 0), promotion));   // 1 up, promote
            POSSIBLE_MOVES.push(new Move(coordinates, new Coordinates(coordinates.x - 1, coordinates.y - 1), promotion));   // 1 up, 1 left, promote
            POSSIBLE_MOVES.push(new Move(coordinates, new Coordinates(coordinates.x - 1, coordinates.y + 1), promotion));   // 1 up, 1 right, promote
            POSSIBLE_MOVES.push(new Move(coordinates, new Coordinates(coordinates.x + 1, coordinates.y + 0), promotion));   // 1 down, promote
            POSSIBLE_MOVES.push(new Move(coordinates, new Coordinates(coordinates.x + 1, coordinates.y - 1), promotion));   // 1 down, 1 left, promote
            POSSIBLE_MOVES.push(new Move(coordinates, new Coordinates(coordinates.x + 1, coordinates.y + 1), promotion));   // 1 down, 1 right, promote
        });

        return POSSIBLE_MOVES;
    }

    static isEnPassant(board, move) {
        const RELATIVE_TOP = board.getPiece(move.position).color === Color.WHITE ? -1 : 1;

        return !board.previousMove.isInvalid()
            && board.getPiece(move.position).type === PieceType.PAWN
            && board.getPiece(board.previousMove.newPosition).type === PieceType.PAWN
            && board.getPiece(board.previousMove.newPosition).moveCount === 1
            && board.previousMove.newPosition.x === (board.previousMove.position.x - 2 * RELATIVE_TOP)
            && board.previousMove.newPosition.y === board.previousMove.position.y
            && board.previousMove.newPosition.x === move.position.x
            && move.newPosition.y === board.previousMove.newPosition.y
            && (move.newPosition.x - RELATIVE_TOP) === board.previousMove.newPosition.x
            && (
                board.previousMove.newPosition.y === (move.position.y - 1)
                || board.previousMove.newPosition.y === (move.position.y + 1)
            )
    }

    static isPawnPromotion(board, move) {
        const RELATIVE_BACK_RANK = board.getPiece(move.position).color === Color.WHITE ? 0 : (board.setup.length - 1);

        return board.getPiece(move.position).type === PieceType.PAWN
            && move.newPosition.x === RELATIVE_BACK_RANK;
    }

    static getPossiblePawnPromotions() {
        return [
            PieceType.QUEEN,
            PieceType.ROOK,
            PieceType.KNIGHT,
            PieceType.BISHOP
        ]
    }

    static isLegalPawnMove(board, move, includePromotions = true) {
        const PAWN = board.getPiece(move.position);
        let possibleMoves = Rules.getPossiblePawnMoves(move.position);
        let relativeTop = -1;

        // Filter invalid moves
        possibleMoves = possibleMoves.filter(possibleMove => {
            return !possibleMove.isInvalid();
        });

        // Filter on pawn color
        if(PAWN.color === Color.WHITE) {
            possibleMoves = possibleMoves.filter(possibleMove => {
                return possibleMove.newPosition.x < possibleMove.position.x;
            });
        } else {
            relativeTop = 1;
            possibleMoves = possibleMoves.filter(possibleMove => {
                return possibleMove.position.x < possibleMove.newPosition.x;
            });
        }

        const TWO_UP_COORDINATES = new Coordinates(move.position.x + relativeTop * 2, move.position.y);

        // Filter if two up is not possible
        if(
             0 < PAWN.moveCount
            || TWO_UP_COORDINATES.isInvalid()
            || board.getPiece(TWO_UP_COORDINATES).type !== PieceType.EMPTY
        ) {
            possibleMoves = possibleMoves.filter(possibleMove => {
                return possibleMove.newPosition.x !== (possibleMove.position.x + relativeTop * 2);
            });
        }

        const ONE_UP_COORDINATES = new Coordinates(move.position.x + relativeTop, move.position.y);

        // Filter if one up is not possible
        if(ONE_UP_COORDINATES.isInvalid() || board.getPiece(ONE_UP_COORDINATES).type !== PieceType.EMPTY) {
            possibleMoves = possibleMoves.filter(possibleMove => {
                return (
                        possibleMove.newPosition.x !== (possibleMove.position.x + relativeTop)
                        && possibleMove.newPosition.x !== (possibleMove.position.x + relativeTop * 2)
                    ) || possibleMove.newPosition.y !== possibleMove.position.y;
            });
        }

        // Filter for captures
        possibleMoves = possibleMoves.filter(possibleMove => {
            return possibleMove.newPosition.y === possibleMove.position.y
                || board.getPiece(possibleMove.newPosition).type !== PieceType.EMPTY
                || Rules.isEnPassant(board, possibleMove);
        });

        // Filter on promotions
        if(Rules.isPawnPromotion(board, move) && includePromotions) {
            possibleMoves = possibleMoves.filter(possibleMove => {
                return possibleMove.promoteToPieceType !== null;
            });
        } else {
            possibleMoves = possibleMoves.filter(possibleMove => {
                return possibleMove.promoteToPieceType === null;
            });
        }

        let isLegal = false;

        possibleMoves.forEach(possibleMove => {
            if (possibleMove.equals(move)) {
                isLegal = true;
            }
        });

        return isLegal;
    }

    static getPossibleRookMoves(coordinates) {
        let res = [];

        for (let i = 0; i < 8; i++) {
            res.push(new Move(coordinates, new Coordinates(coordinates.x, i)));
            res.push(new Move(coordinates, new Coordinates(i, coordinates.y)));
        }

        return res;
    }

    static isLegalRookMove(board, move) {
        let smallIndex, bigIndex, searchArray, isYConstant = false;

        if (move.position.x === move.newPosition.x) {
            searchArray = board.setup[move.position.x];

            if (move.position.y < move.newPosition.y) {
                smallIndex = move.position.y;
                bigIndex = move.newPosition.y;
            } else if (move.newPosition.y < move.position.y) {
                smallIndex = move.newPosition.y;
                bigIndex = move.position.y;
            } else {
                return false;
            }
        } else if (move.position.y === move.newPosition.y) {
            searchArray = board.setup;
            isYConstant = true;

            if (move.position.x < move.newPosition.x) {
                smallIndex = move.position.x;
                bigIndex = move.newPosition.x;
            } else if (move.newPosition.x < move.position.x) {
                smallIndex = move.newPosition.x;
                bigIndex = move.position.x;
            } else {
                return false;
            }
        } else {
            return false;
        }

        for (let i = smallIndex + 1; i < bigIndex; i++) {
            const PIECE = isYConstant ? searchArray[i][move.position.y] : searchArray[i];

            if (PIECE.type !== PieceType.EMPTY) {
                return false;
            }
        }

        return true;
    }

    static getPossibleKnightMoves(coordinates) {
        return [
            new Move(coordinates, new Coordinates(coordinates.x - 2, coordinates.y - 1)),  // 2 up,    1 left
            new Move(coordinates, new Coordinates(coordinates.x - 2, coordinates.y + 1)),  // 2 up,    1 right
            new Move(coordinates, new Coordinates(coordinates.x - 1, coordinates.y + 2)),  // 2 right, 1 up
            new Move(coordinates, new Coordinates(coordinates.x + 1, coordinates.y + 2)),  // 2 right, 1 down
            new Move(coordinates, new Coordinates(coordinates.x + 2, coordinates.y + 1)),  // 2 down,  1 right
            new Move(coordinates, new Coordinates(coordinates.x + 2, coordinates.y - 1)),  // 2 down,  1 left
            new Move(coordinates, new Coordinates(coordinates.x + 1, coordinates.y - 2)),  // 2 left,  1 down
            new Move(coordinates, new Coordinates(coordinates.x - 1, coordinates.y - 2))   // 2 left,  1 up
        ];
    }

    static isLegalKnightMove(board, move) {
        const POSSIBLE_MOVES = Rules.getPossibleKnightMoves(move.position);
        let isLegal = false;

        POSSIBLE_MOVES.forEach(POSSIBLE_MOVE => {
            if (POSSIBLE_MOVE.equals(move)) {
                isLegal = true;
            }
        });

        return isLegal;
    }

    static getPossibleBishopMoves(coordinates) {
        let res = [], x = coordinates.x, y = coordinates.y;

        // top, left
        do {
            x--;
            y--;

            if(0 <= x && 0 <= y) {
                res.push(new Move(coordinates, new Coordinates(x, y)));
            }
        } while (0 < x && 0 < y);

        x = coordinates.x;
        y = coordinates.y;

        // top, right
        do {
            x--;
            y++;

            if(0 <= x && y <= 7) {
                res.push(new Move(coordinates, new Coordinates(x, y)));
            }
        } while (0 < x && y < 7);

        x = coordinates.x;
        y = coordinates.y;

        // bottom, left
        do {
            x++;
            y--;

            if(x <= 7 && 0 <= y) {
                res.push(new Move(coordinates, new Coordinates(x, y)));
            }
        } while (x < 7 && 0 < y);

        x = coordinates.x;
        y = coordinates.y;

        // bottom, right
        do {
            x++;
            y++;

            if(x <= 7 && y <= 7) {
                res.push(new Move(coordinates, new Coordinates(x, y)));
            }
        } while (x < 7 && y < 7);

        return res;
    }

    static isLegalBishopMove(board, move) {
        let possibleMoves = [], x = move.position.x, y = move.position.y;

        // top, left
        do {
            x--;
            y--;

            const possibleMove = new Move(move.position, new Coordinates(x, y));

            if(0 <= x && 0 <= y && (
                board.getPiece(possibleMove.newPosition).type === PieceType.EMPTY
                || !Rules.isMoveToFriendlyField(board, possibleMove)
            )) {
                possibleMoves.push(possibleMove);
            }
        } while (0 < x && 0 < y && board.getPiece(new Coordinates(x, y)).type === PieceType.EMPTY);

        x = move.position.x;
        y = move.position.y;

        // top, right
        do {
            x--;
            y++;

            const possibleMove = new Move(move.position, new Coordinates(x, y));

            if(0 <= x && y <= 7 && (
                board.getPiece(new Coordinates(x, y)).type === PieceType.EMPTY
                || !Rules.isMoveToFriendlyField(board, possibleMove)
            )) {
                possibleMoves.push(possibleMove);
            }
        } while (0 < x && y < 7 && board.getPiece(new Coordinates(x, y)).type === PieceType.EMPTY);

        x = move.position.x;
        y = move.position.y;

        // bottom, left
        do {
            x++;
            y--;

            const possibleMove = new Move(move.position, new Coordinates(x, y));

            if(x <= 7 && 0 <= y && (
                board.getPiece(new Coordinates(x, y)).type === PieceType.EMPTY
                || !Rules.isMoveToFriendlyField(board, possibleMove)
            )) {
                possibleMoves.push(possibleMove);
            }
        } while (x < 7 && 0 < y && board.getPiece(new Coordinates(x, y)).type === PieceType.EMPTY);

        x = move.position.x;
        y = move.position.y;

        // bottom, right
        do {
            x++;
            y++;

            const possibleMove = new Move(move.position, new Coordinates(x, y));

            if(x <= 7 && y <= 7 && (
                board.getPiece(new Coordinates(x, y)).type === PieceType.EMPTY
                || !Rules.isMoveToFriendlyField(board, possibleMove)
            )) {
                possibleMoves.push(possibleMove);
            }
        } while (x < 7 && y < 7 && board.getPiece(new Coordinates(x, y)).type === PieceType.EMPTY);

        let isLegal = false;

        possibleMoves.forEach(possibleMove => {
            if (possibleMove.equals(move)) {
                isLegal = true;
            }
        });

        return isLegal;
    }

    static getPossibleQueenMoves(coordinates) {
        let res = [];

        res.push(...Rules.getPossibleRookMoves(coordinates));
        res.push(...Rules.getPossibleBishopMoves(coordinates));

        return res;
    }

    static isLegalQueenMove(board, move) {
        return Rules.isLegalRookMove(board, move) || Rules.isLegalBishopMove(board, move);
    }

    static getPossibleKingMoves(coordinates) {
        return [
            new Move(coordinates, new Coordinates(coordinates.x - 1, coordinates.y - 1)),   // 1 up, 1 left
            new Move(coordinates, new Coordinates(coordinates.x - 1, coordinates.y + 0)),   // 1 up
            new Move(coordinates, new Coordinates(coordinates.x - 1, coordinates.y + 1)),   // 1 up, 1 right
            new Move(coordinates, new Coordinates(coordinates.x + 0, coordinates.y + 1)),   // 1 right
            new Move(coordinates, new Coordinates(coordinates.x + 0, coordinates.y + 2)),   // 2 right
            new Move(coordinates, new Coordinates(coordinates.x + 1, coordinates.y + 1)),   // 1 down, 1 right
            new Move(coordinates, new Coordinates(coordinates.x + 1, coordinates.y + 0)),   // 1 down
            new Move(coordinates, new Coordinates(coordinates.x + 1, coordinates.y - 1)),   // 1 down, 1 left
            new Move(coordinates, new Coordinates(coordinates.x + 0, coordinates.y - 1)),   // 1 left
            new Move(coordinates, new Coordinates(coordinates.x + 0, coordinates.y - 2)),   // 2 left
        ];
    }

    static isShortCastle(board, move) {
        const ROOK_SQUARE = board.turn === Color.WHITE ? board.getPiece(new Coordinates(7, 7)) : board.getPiece(new Coordinates(0, 7));

        return board.getPiece(move.position).type === PieceType.KING
            && board.getPiece(move.position).moveCount === 0
            && board.getPiece(move.position).color === board.turn
            && move.position.x === move.newPosition.x
            && (move.position.y + 2) === move.newPosition.y
            && ROOK_SQUARE.type === PieceType.ROOK
            && ROOK_SQUARE.moveCount === 0
            && ROOK_SQUARE.color === board.turn
            && board.getPiece(new Coordinates(move.position.x, move.position.y + 1)).type === PieceType.EMPTY
            && board.getPiece(new Coordinates(move.position.x, move.position.y + 2)).type === PieceType.EMPTY
            && !Rules.isCheck(board, board.turn)
            && !Rules.doesMoveResultInCheck(board, new Move(move.position, new Coordinates(move.position.x, move.position.y + 1)), board.turn);
    }

    static isLongCastle(board, move) {
        const ROOK_SQUARE = board.turn === Color.WHITE ? board.getPiece(new Coordinates(7, 0)) : board.getPiece(new Coordinates(0, 0));

        return board.getPiece(move.position).type === PieceType.KING
            && board.getPiece(move.position).moveCount === 0
            && board.getPiece(move.position).color === board.turn
            && move.position.x === move.newPosition.x
            && (move.position.y - 2) === move.newPosition.y
            && ROOK_SQUARE.type === PieceType.ROOK
            && ROOK_SQUARE.moveCount === 0
            && ROOK_SQUARE.color === board.turn
            && board.getPiece(new Coordinates(move.position.x, move.position.y - 1)).type === PieceType.EMPTY
            && board.getPiece(new Coordinates(move.position.x, move.position.y - 2)).type === PieceType.EMPTY
            && !Rules.isCheck(board, board.turn)
            && !Rules.doesMoveResultInCheck(board, new Move(move.position, new Coordinates(move.position.x, move.position.y - 1)), board.turn);
    }

    static isLegalKingMove(board, move) {
        let possibleMoves = Rules.getPossibleKingMoves(move.position);

        if (!Rules.isShortCastle(board, move)) {
            possibleMoves = possibleMoves.filter(possibleMove => {
                return possibleMove.newPosition.y < (possibleMove.position.y + 2);
            });
        }

        if(!Rules.isLongCastle(board, move)) {
            possibleMoves = possibleMoves.filter(possibleMove => {
                return (possibleMove.position.y - 2) < possibleMove.newPosition.y;
            });
        }

        let isLegal = false;

        possibleMoves.forEach(possibleMove => {
            if (possibleMove.equals(move)) {
                isLegal = true;
            }
        });

        return isLegal;
    }
}
