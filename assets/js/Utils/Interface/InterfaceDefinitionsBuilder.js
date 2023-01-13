class InterfaceDefinitionsBuilder {
    #definitions;

    constructor() {
        this.#definitions = [];
    }

    addRequiredMethod(name) {
        this.#definitions.push({
            type: 'function',
            name: name
        });

        return this;
    }

    toArray() {
        return this.#definitions;
    }
}
