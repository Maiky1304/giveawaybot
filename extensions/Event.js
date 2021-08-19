module.exports = class Event {

    constructor(client, event, properties) {
        this.client = client;
        this.event = event;
        this.properties = properties;
    }

    execute(...args) {}

}