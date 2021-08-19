const Event = require('./Event');
const Guild = require('../models/Guild');

module.exports = class CommandHandler extends Event {

    constructor(client) {
        super(client, "interactionCreate", {
            type: 'on'
        });
    }

    async execute(interaction) {
        // Check if interaction is command otherwise return
        if (!interaction.isCommand()) return;

        // Find command and process
        const name = interaction.commandName;

        // Check collection
        if (!this.client.executables.has(name)) return;

        // Check if guild exists
        const guild = await Guild.find({ guildId: interaction.guild.id });
        if ((name !== 'developer' && name !== 'language') && (!guild || !guild.language)) {
            await interaction.reply({ embeds: [ this.client.getEmbed('error',
                    { '{message}': 'Please select a **language** for the bot first using **/language set**.' }) ] })
            return;
        }

        // Execute
        await this.client.executables.get(name).execute(interaction, guild);
    }


}
