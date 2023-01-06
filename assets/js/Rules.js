class Rules {
    static isLegalMove(board, move) {
        return Rules.isLegalMoveByPieceType(board, move)
            && !Rules.doesMoveResultInCheck(board, move);
    }

    static getLegalMoves(board, coordinates) {
        const POSSIBLE_MOVES = Rules.getPossibleMovesByPieceType(board, coordinates);
        const LEGAL_MOVES = [];

        console.log(POSSIBLE_MOVES);

        POSSIBLE_MOVES.forEach(possibleMove => {
            if (Rules.isLegalMove(board, possibleMove)) {
                LEGAL_MOVES.push(possibleMove);
            }
        });

        return LEGAL_MOVES;
    }

    static getPossibleMovesByPieceType(board, coordinates) {
        switch (board.getPiece(coordinates).type) {
            case PieceType.EMPTY:
                return [];
            case PieceType.ROOK:
                return Rules.getPossibleRookMoves(coordinates);
            case PieceType.KNIGHT:
                return Rules.getPossibleKnightMoves(coordinates);
            default:
                return [];
        }
    }

    static isLegalMoveByPieceType(board, move) {
        if (
            move.isInvalid()
            || !Rules.isFriendlyPiece(board, move.position)
            || Rules.isMoveToFriendlyField(board, move)
        ) {
            return false;
        }

        switch (board.getPiece(move.position).type) {
            case PieceType.EMPTY:
                return false;
            case PieceType.ROOK:
                return Rules.isLegalRookMove(board, move);
            case PieceType.KNIGHT:
                return Rules.isLegalKnightMove(board, move);
            case PieceType.BISHOP:
                return Rules.isLegalBishopMove(board, move);
            default:
                return true;
        }
    }

    static isFriendlyPiece(board, coordinates) {
        return board.getPiece(coordinates).color === board.turn;
    }

    static isMoveToFriendlyField(board, move) {
        const PIECE = board.getPiece(move.position);
        const NEW_PIECE = board.getPiece(move.newPosition);

        return NEW_PIECE.type !== PieceType.EMPTY && PIECE.color === NEW_PIECE.color;
    }

    static doesMoveResultInCheck(board, move) {
        const NEW_BOARD = BoardFactory.createInstance(Helper.deepCopy(board.setup));
        NEW_BOARD.doMove(move);

        return Rules.isCheck(NEW_BOARD);
    }

    static isCheck(board) {
        const KING_COORDINATES = board.findKingCoordinates(board.turn);

        if (KING_COORDINATES.isInvalid()) {
            return false;
        }

        // todo: find all opposite color pieces and see if capturing the king is legal

        return false;
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
            if (POSSIBLE_MOVE.newPosition.equals(move.newPosition)) {
                isLegal = true;
            }
        });

        return isLegal;
    }

    static isLegalBishopMove(board, move) {
        // todo
    }
}
