class Move {
    static get INVALID() {
        return new Move();
    }

    constructor(coordinates = Coordinates.INVALID, newCoordinates = Coordinates.INVALID) {
        this.position = coordinates;
        this.newPosition = newCoordinates;
    }

    equals(move) {
        return this.position.equals(move.position) && this.newPosition.equals(move.newPosition);
    }

    isInvalid() {
        return this.position.isInvalid() || this.newPosition.isInvalid();
    }
}
