const Command = require('../../extensions/Command');

module.exports = class SetLanguageCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'language',
            description: 'This has all the language subcommands',
            options: [
                {
                    name: 'set',
                    description: 'Change the language of the current guild',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'country',
                            description: 'Provide a valid country code here that we support see all the languages using /language info',
                            type: 'STRING',
                            required: true,
                            choices: client.createLanguageModel()
                        }
                    ]
                },
                {
                    name: 'info',
                    description: 'Get information about the language system',
                    type: 'SUB_COMMAND'
                }
            ]
        });
    }

    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        if (subCommand === 'set') {
            return this.setLanguage(interaction);
        } else if (subCommand === 'info') {
            return this.information(interaction);
        }
    }

    async setLanguage(interaction) {
        await interaction.deferReply();
    }

    async information(interaction) {
        await interaction.deferReply();
    }

}