const { Client, Collection, MessageEmbed } = require('discord.js');
const glob = require('glob-promise');
require('dotenv').config();

const builders = require('@discordjs/builders');

const Logger = require('./Logger');
const Status = require("./Status");

const fs = require('fs');

const mongoose = require('mongoose');

module.exports = class GClient extends Client {

     constructor(options) {
        super(options);

        // Bind Loggers
        this.error = new Logger('ERROR', 'red', 'error');
        this.info = new Logger('INFO', 'green');
        this.warning = new Logger('WARNING', 'yellow');
        this.commands = new Logger('COMMANDS', 'blue');
        this.events = new Logger('EVENTS', 'magenta');

         this.bindLanguages();

        // Collection to store all commands
        this.executables = new Collection();
        this.commandData = new Collection();

        // Bind all the necessary handlers
        this.bindCommands();
        this.bindEvents();

        // Register all commands at API
        const APIHandler = require('./APIHandler');
        const Client = this;
        this.bind('ready', async () => {
            Client.APIHandler = new APIHandler(Client);
            await Client.APIHandler.register();

            // Load command handler
            this.loadEvent('extensions/CommandHandler');
        });

        // Statuses
        const status = new Status(this);
        status.addStatus(async () => {
            await this.guilds.fetch();

            const results = await this.guilds.cache;
            return `${results.size} guild${results.size === 1 ? '' : 's'}`
        });
        status.addStatus(async () => {
            await this.guilds.fetch();

            const results = await this.guilds.cache;
            const users = results.reduce((acc, guild) => acc + guild.memberCount, 0);
            return `${users} user${users === 1 ? '' : 's'}`;
        });
        status.addStatus(() => 'giveawaybot.club');
        this.bind('ready', () => status.launch(5));

        // Launch MongoDB Application
        this.mongodb = new Logger('DB', 'brightGreen');
        this.mongodb.log('Connecting to MongoDB database...');
        const connected = () => this.mongodb.log('Successfully connected with MongoDB database.');
        mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true }).then(_result => connected());
    }

    bind(event, callback) {
        this.once(event, () => callback());
    }

    loadCommand(path) {
        const Command = require('../' + path);
        const command = new Command(this);

        this.executables.set(command.properties.name, command);
        this.commandData.set(command.properties.name, command.properties);

        this.commands.log(`Registered slash command ${`${'/' + command.properties.name}`.blue.bold}.`);
    }

    loadEvent(path) {
        const script = require('../' + path);
        const event = new script(this);

        this[event.properties.type](event.event, (...args) => event.execute(...args));

        this.events.log(`Now listening for ${event.event.magenta.bold} using the method ${event.properties.type.magenta.bold}.`)
    }

    bindCommands(dir = 'commands') {
        glob.promise(`${dir}/**/*.js`).then(results => results.forEach(result => this.loadCommand(result)))
            .catch(_err => {});
    }

    bindEvents(dir = 'events') {
        glob.promise(`${dir}/**/*.js`).then(results => results.forEach(result => this.loadEvent(result)))
            .catch(_err => {});
    }

    /**
     * Bind all the languages to the client instance
     * @param dir directory of all language packs
     */
    bindLanguages(dir = 'languages') {
        let packDir = fs.readdirSync(dir);

        // Create folder if it doesn't exist
        if (!packDir) {
            fs.mkdirSync(dir);
            packDir = fs.readdirSync(dir);
        }

        // Create collection for packs
        this.languages = new Collection();

        // Read all packs
        for (const file of packDir) {
            const binary = fs.readFileSync(`${dir}/${file}`);
            const json = JSON.parse(binary);

            // Calculate Messages
            json.messageCount = 0;
            for (const key in json['pack']) {
                const value = json['pack'][key];
                if (typeof value === 'string') {
                    json.messageCount++;
                }
            }

            this.languages.set(file.slice(0, file.length - '.json'.length), json);
        }
    }

    /**
     * Finds a language and returns the properties of that file when
     * it found something or null.
     * @param parameters a consume-java-style object that checks whether this is the right language
     * @return {Object}
     */
    findLanguage(parameters) {
         for (const properties of this.languages.values()) {
             if (parameters(properties)) {
                 return properties;
             }
         }
         return null;
    }

    createLanguageModel() {
        const models = [];

        for (const properties of this.languages.values()) {
            models.push({
                name: properties.emoji + ' ' + properties.name,
                value: properties.name
            });
        }

        return models;
    }

    /**
     * Find a template if it doesn't exist it returns undefined.
     * @param template
     * @param placeholders
     * @returns {MessageEmbed}
     */
    getEmbed(template, placeholders) {
        let data;
        try {
            data = fs.readFileSync(`embeds/${template}.json`);
        } catch (error) {
            return undefined;
        }

        const embed = JSON.parse(data);

        if (placeholders && placeholders.length !== 0) {
            for (const placeholder in placeholders) {
                for (const key in embed) {
                    let value = embed[key];

                    if (typeof value === 'string') {
                        if (!value.includes(placeholder)) continue;
                        value = value.replace(placeholder, placeholders[placeholder]);
                        embed[key] = value;
                    } else if (value instanceof Map) {
                        for (const childKey in value) {
                            let childValue = value[childKey];
                            if (typeof childValue === 'boolean') continue;
                            if (!childValue.includes(placeholder)) continue;
                            childValue = childValue.replace(placeholder, placeholders[placeholder]);
                            embed[key][childKey] = childValue;
                        }
                    } else if (value instanceof Array) {
                        for (let i = 0; i < value.length; i++) {
                            for (const childKeyUnderChild in value[i]) {
                                let childValue = value[i][childKeyUnderChild];

                                if (typeof childValue === 'boolean') continue;

                                if (!childValue.includes(placeholder)) continue;
                                childValue = childValue.replace(placeholder, placeholders[placeholder]);
                                embed[key][i][childKeyUnderChild] = childValue;
                            }
                        }
                    }
                }
            }
        }

        return embed;
    }

    createHyperlink(label, url) {
        return builders.hyperlink(label, url);
    }

    formatEmoji(emojiId, animated) {
        return builders.formatEmoji(emojiId, animated);
    }

}