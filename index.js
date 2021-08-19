const GClient = require('./extensions/GClient');
const { Intents } = require('discord.js');

console.log(`${'\n' +
'   ___ _____   _____   ___      _____   __  ___  ___ _____ \n' +
'  / __|_ _\\ \\ / / __| /_\\ \\    / /_\\ \\ / / | _ )/ _ \\_   _|\n' +
' | (_ || | \\ V /| _| / _ \\ \\/\\/ / _ \\ V /  | _ \\ (_) || |  \n' +
'  \\___|___| \\_/ |___/_/ \\_\\_/\\_/_/ \\_\\_|   |___/\\___/ |_|  \n' +
'                                                           \n                      By Maiky Perlee'}`.green.bold);
console.log('*-----------------------------------------------------------------*\n')

const client = new GClient({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES ], shards: "auto" });
client.login(process.env.TOKEN);