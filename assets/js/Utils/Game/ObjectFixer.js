class ObjectFixer {
    static fixEnum(object, enumClass) {
        return object && object.properties ? enumClass.getFromProperties(object.properties) : null;
    }

    static fixPieceType(object) {
        return this.fixEnum(object, PieceType);
    }

    static fixColor(object) {
        return this.fixEnum(object, Color);
    }

    static fixBoardSetup(setup) {
        for(let x = 0; x < setup.length; x++) {
            for(let y = 0; y < setup[x].length; y++) {
                setup[x][y] = new Piece(this.fixPieceType(setup[x][y].type), this.fixColor(setup[x][y].color));
            }
        }

        return setup;
    }
}
