class Interface {
    #definitions;
    #name;

    constructor(name = 'Interface', definitions = []) {
        this.#name = name;
        this.#definitions = definitions;

        this.checkDefinitions();
    }

    checkDefinitions() {
        this.#definitions.forEach(definition => {
            if(typeof this[definition.name] !== definition.type) {
                throw new Error(`in ${this.constructor.name}: Classes that implement interface ${this.#name} must define ${definition.type} '${definition.name}'`);
            }
        });
    }

    static getDefinitionsBuilder() {
        return new InterfaceDefinitionsBuilder();
    }
}
