const Command = require('../../extensions/Command');

module.exports = class TestEmbedCommand extends Command {

    constructor(client) {
        super(client, {
            name: 'developer',
            description: 'This has all the Developer subcommands',
            defaultPermission: false,
            options: [
                {
                    name: 'testembed',
                    description: "Test an embed that is in the bot's embeds folder.",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'filename',
                            type: 'STRING',
                            description: 'The file that contains the embed data in JSON.',
                            required: true
                        }
                    ]
                },
                {
                    name: 'reload',
                    description: "Reload the bot",
                    type: 'SUB_COMMAND'
                },
                {
                    name: 'testlanguage',
                    description: 'Test a language',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'query',
                            type: "STRING",
                            description: 'Query to find the language',
                            required: true
                        }
                    ]
                }
            ],
            permissions: [
                {
                    id: '603623288693981195',
                    type: 'USER',
                    permission: true
                }
            ]
        });
    }

    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        if (subCommand === 'testembed') {
            return this.testEmbed(interaction);
        } else if (subCommand === 'reload') {
            return this.reloadBot(interaction);
        } else if (subCommand === 'testlanguage') {
            return this.testLanguage(interaction);
        }
    }

    async testLanguage(interaction) {
        const query = interaction.options.getString('query');

        const pack = this.client.findLanguage(properties => {
            if (properties.tags.includes(query)) {
                return true;
            }

            if (properties.name === query) {
                return true;
            }

            if (properties.emoji === query) {
                return true;
            }
        });

        if (!pack) {
            await interaction.reply({ ephemeral: true, embeds: [ this.client.getEmbed('common/error', { '{message}': 'This language pack could not be found.' }) ] });
            return;
        }

        await interaction.reply({ ephemeral: true, embeds: [ this.client.getEmbed('language.preview',
                {
                    '{emoji}': pack.emoji,
                    '{pack_name}': pack.name,
                    '{pack_messages_amount}': pack.messageCount,
                    '{pack_messages_decide_s}': pack.messageCount === 1 ? '' : 's',
                    '{pack_tags}': pack.tags.join(', ')
                })]})
    }

    async reloadBot(interaction) {

    }

    async testEmbed(interaction) {
        const fileName = interaction.options.getString('filename');
        const embed = this.client.getEmbed(fileName.endsWith('.json') ? fileName.slice(0, fileName.length - '.json'.length) : fileName);
        if (!embed) {
            await interaction.reply({ embeds: [ this.client.getEmbed('error', { '{message}': "I couldn't find the embed with the name **" + fileName + "**." }) ] });
            return;
        }
        try {
            await interaction.reply({ embeds: [ this.client.getEmbed(fileName) ] })
        } catch (error) {
            this.client.error.log('There was an error with the interaction of ' + interaction.user.id + ' with the command '
                + interaction.commandName);
        }
    }

}