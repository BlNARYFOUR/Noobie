class BoardFactory {
    static #instance = null;

    static getInstance() {
        if(!BoardFactory.#instance) {
            BoardFactory.#instance = new BoardFactory();
        }

        return BoardFactory.#instance;
    }

    constructor() {
        this.nextId = 0;
        BoardFactory.#instance = this;
    }

    createBoard(setup = [], turn = Color.WHITE, moveHistory = []) {
        return new Board(this.nextId++, setup, turn, moveHistory);
    }

    createDefaultBoard() {
        return this.createBoard().createDefaultSetup();
    }
}
