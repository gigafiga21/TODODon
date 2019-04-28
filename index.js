const path = require('path');
const directory = require('./fileSystem');
const console   = require('./console');
const engine  = require('./engine');
const {Comment}   = require('./comment');
const {Table}   = require('./table');

/**
 * Forms table row object from parced TODO comment and file name where it was found
 * @param  {Comment} TODO - parced comment
 * @return {Object}
 */
function formOutput(TODO) {
    return {
        '!': TODO.importance ? '!' : '',
        'user': TODO.user,
        'date': TODO.date,
        'comment': TODO.text,
        'file name': TODO.file
    };
}

/**
 * Forms data array from array of TODO comments
 * @param  {Array}          found            - array of comments
 * @param  {String}         found[].filePath - path to the file where comments was found
 * @param  {Array}          found[].comments - TODO comments
 * @return {Array[Comment]}
 */
function formData(found) {
    let data = [];

    for (const quant of found) {
        for (const comment of quant.comments) {
            data.push(new Comment(comment, quant.fileName));
        }
    }

    return data;
}

/**
 * Creates table in the console
 * @param {Array[Comment]} data         - found comments
 * @param {Boolean}        cutTableRows - if true then strings which not match cells widths will be cutted
 */
function generateTable(data, cutTableRows) {
    var separators;
    if (!this.drawFrame) {
        separators = {
            vertical: '|', verticalBorder: '', horizontalBorder: ' ',
            cross: '', topCross: '', bottomCross: '', leftCross: '-', rightCross: '-',
            topLeft: '', topRight: '', bottomLeft: '', bottomRight: '', header: '-'
        }
    }

    let table = new Table(['!', 'user', 'date', 'comment', 'file name'], data.map((quant) => formOutput(quant)));
    table.setSplit(!cutTableRows);
    table.setSeparators(separators);
    table.setMaxColumnLength([1, 10, 10, 50, 15]);
    table.setMinColumnLength([1, 6, 10, 20, 9]);
    table.draw();
}

/**
 * Main class
 */
class App {
    /**
     * Setts up starting settings
     */
    initSettings () {
        this.cutTableRows = true;
        this.drawFrame = false;
    }

    /**
     * Reads and stores all files contains in directory opened in console
     * @constructor
     */
    constructor () {
        console.onEnd(this.processCommand.bind(null, 'exit'));

        this.initSettings();
        this.files = directory.getAllFilePathsWithExtension(process.cwd(), 'js').map(path => {
                let file = new directory.File(path);
                file.readin();
                return file;
            });

        let drawing = require('./respects.txt').split('$$');
        this.respects = {
            '92': drawing[0],
            '47': drawing[1]
        };

        /**
         *  ┌────┐  ┌────┐
         * ┌┘    └┐┌┘    └┐Made
         *┌┘      └┘      └┐with
         *│                │love
         *└┐              ┌┘and
         * └─┐          ┌─┘JavaScript
         *   └─┐      ┌─┘
         *     └─┐  ┌─┘
         *       └──┘
         */

        let command = process.argv;
        if (command.length > 2) {
            this.processCommand(command.slice(2).join(' '));
            this.processCommand('exit');
            return;
        }

        console.writeLine('Please, write your command!\x1b[31m');
        console.readLine(this.processCommand.bind(this));
    }

    /**
     * Waits for command in the console and parses it
     * @param {String} command - command (1-2 keywords and 0-1 flag)
     */
    processCommand(command) {
        let counter = 1,
            found;

        console.write('\x1b[0m');

        command = command.split(' ');
        while (counter < command.length) {
            if (command[counter][0] == '-') {
                switch (command[counter]) {
                    case '-nocut':
                        this.cutTableRows = false;
                        break;
                    case '-frame':
                        this.drawFrame = true;
                        break;
                    default:
                        console.writeLine('\x1b[1mUnrecognized flag \"' + command[counter] + '\". Skipping...\x1b[0m');
                        break;
                }
                command.splice(counter, 1);
            } else {
                counter++;
            }
        }

        switch (command[0]) {
            case 'show':
                found = formData(engine.searchTODO(this.files));
                generateTable.call(this, found, this.cutTableRows);
                break;
            case 'important':
                found = formData(engine.searchTODO(this.files, '!'));
                generateTable.call(this, found, this.cutTableRows);
                break;
            case 'user':
                found = formData(engine.searchTODO(this.files, command[1]));
                generateTable.call(this, found, this.cutTableRows);
                break;
            case 'sort':
                found = engine.sortTODO(formData(engine.searchTODO(this.files)), command[1]);
                generateTable.call(this, found, this.cutTableRows);
                break;
            case 'date':
                found = engine.organizeTODO(formData(engine.searchTODO(this.files)), 'date', command[1]);
                generateTable.call(this, found, this.cutTableRows);
                break;
            case 'F':
                console.writeLine('\x1b[1mRespects payed\n');
                let max = 0;
                for (const width in this.respects) {
                    if (width <= process.stdout.columns && width > max) {
                        max = width;
                    }
                }
                console.writeLine(this.respects[max] + '\x1b[0m');
                break;
            case 'exit':
                process.exit(0);
                break;
            default:
                console.writeLine('wrong command');
                break;
        }

        this.initSettings();
        console.write('\x1b[31m');
    }
};

let app = new App();
