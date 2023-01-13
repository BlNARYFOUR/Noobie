class BoardHistory {
    constructor(history = []) {
        this.history = [...history];
    }

    push(board) {
        this.history.push(BoardFactory.getInstance().createBoard(board.setup, board.turn, board.moveHistory));

        return this;
    }

    countBoardStateOccurrence(board) {
        let boardOccurrenceCount = 0;

        this.history.forEach(pastBoard => {
            if(board.equals(pastBoard)) {
                ++boardOccurrenceCount;
            }
        });

        return boardOccurrenceCount;
    }
}
