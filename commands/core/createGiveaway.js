const Command = require('../../extensions/Command');
const Giveaway = require('../../models/Giveaway');

module.exports = class CreateGiveaway extends Command {

    constructor(client) {
        super(client, {
            name: 'creategiveaway',
            description: 'Create a giveaway',
            options: [{
                name: 'description',
                type: 'STRING',
                description: 'Provide some information about the giveaway what should participants know?',
                required: true
            }]
        });
    }

    async execute(interaction, guild) {
        const description = interaction.options.getString('description');

        await interaction.reply({ content: description });
    }

}