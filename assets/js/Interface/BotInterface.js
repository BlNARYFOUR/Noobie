class BotInterface extends Interface {
    constructor(ui, color) {
        super(
            BotInterface.name,
            Interface.getDefinitionsBuilder()
                .addRequiredMethod('start')
                .addRequiredMethod('stop')
                .toArray()
        );
    }
}
