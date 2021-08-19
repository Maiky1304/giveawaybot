const Event = require('../../extensions/Event');

/**
 * This event is meant for when the bot gets added to a new guild
 * @type {GuildCreateEvent}
 */
module.exports = class GuildCreateEvent extends Event {

    constructor(client) {
        super(client, 'guildCreate', { type: 'on' });
    }

    /**
     * This gets fired when the bot joins a new server
     * this means that the bot has to sent information to
     * the system channel or DM of the bot inviter.
     *
     * @param guild
     * @returns {Promise<void>}
     */
    async execute(guild) {
        // announce to console
        this.client.info.log(`The bot was added to a guild with the ID ${guild.id.bold} and the name ${guild.name.bold}, I'm now preparing to send setup information...`);

        // Try and send information to inviter
        const state = await this.sendInformationToInviter(guild);

        // Try and send in welcome channel if previous failed^^
        if (!state) {
            await this.sendInformationInWelcomeChannel(guild);
            // if this fails too than sucks to be them
        }
    }

    /**
     * This function will try to send the information in the welcome
     * / system channel of the guild.
     *
     * @param guild
     * @returns {Promise<boolean>}
     */
    async sendInformationInWelcomeChannel(guild) {
        const channel = guild.systemChannel;

        if (!channel) {
            return false;
        }

        await channel.send(this.getDefaultInformationMessage());
        return true;
    }

    /**
     * This will try to send the information in the DM
     * of the bot inviter, if this fails it will try to
     * send it in the welcome/system channel.
     *
     * @param guild
     * @returns {Promise<boolean>}
     */
    async sendInformationToInviter(guild) {
        const fetchedLogs = await guild.fetchAuditLogs({ type: "BOT_ADD", limit: 1 });
        const log = fetchedLogs.entries.first();

        if (!log) {
            return false;
        }

        const inviter = log.executor;
        try {
            await inviter.send(this.getDefaultInformationMessage());
        } catch (error) {
            this.client.warning.log(`Couldn't send DM to user ${inviter.tag} so I'm trying the welcome/system channel.`);
            return false;
        }
        return true;
    }

    /**
     * This returns the default information message that the bot has to send.
     *
     * @returns {{embeds: *[]}}
     */
    getDefaultInformationMessage() {
        return { embeds: [this.client.getEmbed('welcome' )] };
    }

}
