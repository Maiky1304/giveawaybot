const Event = require('../../extensions/Event');

/**
 * This event is just meant for the console so I can have
 * an indication of when the bot is done loading
 * @type {ReadyEvent}
 */
module.exports = class ReadyEvent extends Event {

    constructor(client) {
        super(client, "ready", { type: 'once' });
    }

    /**
     * Gets fired when the bots starts
     */
    execute() {
        this.client.info.log(`Logged in to ${this.client.user.tag.bold}!`);
    }

}