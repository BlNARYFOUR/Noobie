class Coordinates {
    static get INVALID() {
        return new Coordinates();
    }

    constructor(x = -1, y = -1) {
        this.x = x;
        this.y = y;
    }

    equals(coordinates) {
        return this.x === coordinates.x && this.y === coordinates.y;
    }

    isInvalid() {
        return this.x < 0 || 7 < this.x || this.y < 0 || 7 < this.y;
    }

    toString() {
        return this.x + ',' + this.y;
    }
}
