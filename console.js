const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

/**
 * Setts callback to event of entering line
 * @param {Function} callback - will be called after line typed
 */
function readLine(callback) {
    rl.on('line', callback);
}

/**
 * Prints line with '\n' ending in the console
 * @param {String} message - string to print
 */
function writeLine(message) {
    process.stdout.write(message + "\n");
}

/**
 * Prints line withoutany  endings in the console
 * @param {String} message - string to print
 */
function write(message) {
    process.stdout.write(message);
}

/**
 * Catches Ctrl+C command
 * @param {Function} listener - will be called instead of exiting
 */
function onEnd(listener) {
    rl.on('SIGINT', listener);
}

module.exports = {
    readLine,
    writeLine,
    write,
    onEnd
};
