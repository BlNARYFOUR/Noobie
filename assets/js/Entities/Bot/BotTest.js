class BotTest extends BotInterface {
    #ui;
    #boardId;
    #color;
    #stop;

    constructor(ui, boardId, color) {
        super();

        this.#ui = ui;
        this.#boardId = boardId;
        this.#color = color;
        this.#stop = true;
    }

    async start() {
        this.#stop = false;

        do {
            await this.waitForTurn();
            this.makeRandomMove();
        } while (!this.#stop);
    }

    stop() {
        this.#stop = true;
    }

    waitForTurn() {
        return new Promise((resolve) => {
            const wait = () => {
                setTimeout(() => {
                    if (this.#ui.turn[this.#boardId] === this.#color) {
                        resolve();
                    } else if (!this.#stop) {
                        wait();
                    }
                }, 100);
            }

            wait();
        });
    }

    makeRandomMove() {
        const BOARD = this.#ui.boards[this.#boardId];
        const LEGAL_MOVES = Rules.getAllLegalMoves(BOARD);
        const RANDOM_INDEX = Math.floor(Math.random() * LEGAL_MOVES.length);

        this.#ui.makeHtmlMove(BOARD, LEGAL_MOVES[RANDOM_INDEX], true).then(() => {
            console.log('Bot made a move.');
        });
    }
}
