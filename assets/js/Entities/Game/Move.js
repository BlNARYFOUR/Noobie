class Move {
    static get INVALID() {
        return new Move();
    }

    constructor(coordinates = Coordinates.INVALID, newCoordinates = Coordinates.INVALID, promoteToPieceType = null) {
        this.position = coordinates;
        this.newPosition = newCoordinates;
        this.promoteToPieceType = promoteToPieceType;
    }

    equals(move) {
        return this.position.equals(move.position) && this.newPosition.equals(move.newPosition) && this.promoteToPieceType === move.promoteToPieceType;
    }

    isInvalid() {
        return this.position.isInvalid() || this.newPosition.isInvalid();
    }
}
