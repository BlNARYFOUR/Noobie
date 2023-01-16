document.addEventListener('DOMContentLoaded', init);

let UI;
let BOT_TEST;
let BOT_TEST_WHITE;
let BOT_TEST_BLACK;

function init() {
    UI = new UserInterface();

    const BOARD_ID = UI.createDefaultBoard();

    // const IS_PLAYER_WHITE = !!Math.round(Math.random());
    //
    // UI.showBoard(BOARD_ID, IS_PLAYER_WHITE, !IS_PLAYER_WHITE);
    // BOT_TEST = new BotTest(UI, BOARD_ID, IS_PLAYER_WHITE ? Color.BLACK : Color.WHITE);
    //
    // if(!IS_PLAYER_WHITE) {
    //     UI.flipBoard(BOARD_ID);
    // }
    //
    // BOT_TEST.start();

    UI.showBoard(BOARD_ID, false, false);

    BOT_TEST_WHITE = new BotTest(UI, BOARD_ID, Color.WHITE);
    BOT_TEST_BLACK = new BotTest(UI, BOARD_ID, Color.BLACK);

    BOT_TEST_WHITE.start();
    BOT_TEST_BLACK.start();

    console.log('Game on!');
}
