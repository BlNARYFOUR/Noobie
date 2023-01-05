document.addEventListener('DOMContentLoaded', init);

const UI = new UserInterface();

function init() {
    const BOARD_ID = UI.createDefaultBoard();

    UI.printBoard(BOARD_ID);
}
