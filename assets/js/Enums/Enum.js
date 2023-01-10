class Enum {
    static get LIST() {
        return this.getList();
    }

    static getList() {
        return Object.keys(this).map(key => {
            return {key: this[key].toString(), value: this[key]};
        }).reduce((map, obj) => {
            map[obj.key] = obj.value;
            return map;
        }, {});

    }

    static getFromProperties(properties) {
        return this.LIST[properties];
    }

    constructor(properties) {
        this.properties = properties;
    }

    equals(object) {
        return this.properties === object.properties;
    }

    toString() {
        return this.properties;
    }
}
