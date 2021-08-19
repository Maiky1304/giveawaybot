module.exports = class Status {

    constructor(client) {
        this.client = client;

        this.statuses = [];
        this.index = 0;
    }

    addStatus(text, properties = { type: "WATCHING" }) {
        this.statuses.push({
            text: text,
            properties: properties
        });
    }

    launch(delay) {
        setInterval(() => this.incrementStatus(), 1000 * delay);
    }

    async incrementStatus() {
        if (this.statuses.length === 0) return;

        const status = this.statuses[this.index];

        this.client.user.setActivity(await status.text() + ' | /setup', status.properties);

        this.index++;

        if (this.index === this.statuses.length) {
            this.index = 0;
        }
    }

}
