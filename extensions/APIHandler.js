module.exports = class APIHandler {

    constructor(client) {
        this.client = client;
    }

    async register(dev = process.env.DEV) {
        // cleanup first
        await this.cleanUp();

        const commands = [];

        for (const properties of this.client.commandData.values()) {
            commands.push(properties);
        }

        this.client.info.log(`Starting to refresh application (${'/'.blue.bold}) commands.`);

        await this.client.guilds.cache.get('877242318384668742').commands.set(commands);

        const cache = this.client.guilds.cache.get('877242318384668742').commands.cache;
        for (const cmd of cache.values()) {
            const permissions = this.client.commandData.get(cmd.name).permissions;
            if (permissions) {
                await cmd.permissions.set({permissions});
            }
        }

        this.client.info.log(`Successfully reloaded application (${'/'.blue.bold}) commands.`)
    }

    async cleanUp() {
        await this.client.application.commands.fetch();
        for (const s of this.client.application.commands.cache.keys()) {
            await this.client.application.commands.delete(s);
        }

        await this.client.guilds.fetch();
        for (const guild of this.client.guilds.cache.values()) {
            await guild.commands.fetch();
            for (const s of guild.commands.cache.keys()) {
                await guild.commands.delete(s);
            }
        }
    }

}