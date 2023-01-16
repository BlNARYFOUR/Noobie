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

            if(Rules.getGameState(this.#ui.boards[this.#boardId]) === GameState.ONGOING) {
                // await new Promise((resolve) => {
                //     setTimeout(resolve, 10);
                // });

                this.makeRandomMove();
            } else {
                this.stop();
            }
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
                }, 1);
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
