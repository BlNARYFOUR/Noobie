class GameState extends Enum {
    static #index = 0;

    static ONGOING = new GameState('ongoing');
    static CHECKMATE_WHITE = new GameState('checkmate-white');
    static CHECKMATE_BLACK = new GameState('checkmate-black');
    static DRAW_THREEFOLD_REPETITION = new GameState('draw-threefold-repetition');
    static DRAW_FIFTY_MOVE_RULE = new GameState('draw-fifty-move-rule');
    static DRAW_INSUFFICIENT_MATERIAL = new GameState('draw-insufficient-material');
    static DRAW_STALEMATE = new GameState('draw-stalemate');

    #name = '';

    constructor(name) {
        super(++GameState.#index);
        this.#name = name;
    }

    get NAME() {
        return this.#name;
    }
}