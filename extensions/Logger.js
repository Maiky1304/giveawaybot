const moment = require('moment');
const colors = require('colors');

module.exports = class Logger {

    constructor(name, color, method = 'log') {
        this.name = name.toString();
        this.color = color.toString();
        this.method = method.toString();
    }

    log(message, prefix = undefined) {
        console[this.method](`${`[${this.getDate()}]`.bold} ${colors[this.color](`[${prefix ? prefix : this.name}]`)} ${message}`)
    }

    getDate() {
        return moment().format('LTS');
    }

}