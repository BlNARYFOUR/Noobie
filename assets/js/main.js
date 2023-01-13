document.addEventListener('DOMContentLoaded', init);

let UI;
let BOT_TEST;

function init() {
    UI = new UserInterface();

    const BOARD_ID = UI.createDefaultBoard();
    UI.showBoard(BOARD_ID, true, false);
    BOT_TEST = new BotTest(UI, BOARD_ID, Color.BLACK);

    BOT_TEST.start();
}
