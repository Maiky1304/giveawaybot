module.exports = class Command {

    constructor(client, properties) {
        this.client = client;
        this.properties = properties;
    }

    async execute(interaction) {}

}