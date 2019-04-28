/**
 * Gets length which is enough to store info in cell
 * @param  {Array}  headers - array of columns headers
 * @param  {Array}  data    - array of same type objects to parse them into column names and values
 * @return {Array}
 */
function getEnoughtLength(headers, data) {
    let enoughLength = [];

    for (let counter = 0; counter < headers.length; counter++) {
        enoughLength[counter] = 0;

        for (const row of data) {
            let length = row[headers[counter]].length;

            if (enoughLength[counter] < length) {
                enoughLength[counter] = length;
            }
        }

        if (enoughLength[counter] < headers[counter].length) {
            enoughLength[counter] = headers[counter].length;
        }
    }

    return enoughLength;
}

/**
 * Cutts or splits value of table to fitt table cell length
 * @param  {String}  cellData - string will be putted in cell
 * @param  {Number}  length   - length of the cell
 * @param  {Boolean} split    - split or cut cell value
 * @return {Array}            - array of splitted/cutted cell value
 */
function parceCellData(cellData, length, split) {
    let parcedCellData = [];

    if (split) {
        while (cellData.length > 0) {
            parcedCellData.push(cellData.substr(0, length));
            cellData = cellData.substr(length);
        }
    } else if (cellData.length > length) {
        parcedCellData.push(cellData.substr(0, length - 3) + '...');
    } else {
        parcedCellData.push(cellData);
    }

    return parcedCellData;
}

/**
 * Cutts or splits value of table to fitt table cell length
 * @param  {Object}  rowData - object contains data of table
 * @param  {Array}   lengths - lengths of the cells
 * @param  {Boolean} split   - split or cut cell values
 * @return {Object}          - rowData with arrays of splitted/cutted cell values
 */
function parceRowData(headers, rowData, lengths, split) {
    let parcedRowData = {};

    for (let counter = 0; counter < headers.length; counter++) {
        const header = headers[counter]
        parcedRowData[header] = parceCellData(rowData[header], lengths[counter], split);
    }

    return parcedRowData;
}

/**
 * Prints line from symbol with given width
 * @param {String} main    - symbol from which line consists
 * @param {String} cross   - symbol of crossing table borders between 4 cells
 * @param {String} left    - symbol of line start
 * @param {String} right   - symbol of line end
 * @param {Array}  lengths - lengths of the cells
 * @param {Number} space   - padding between cell value and border
 */
function fillLine(main, cross, left, right, lengths, space) {
    process.stdout.write(left);
    for (let counter = 0; counter < lengths.length - 1; counter++) {
        process.stdout.write(new Array(lengths[counter] + 2 * space).fill(main).join('') + cross);
    }

    process.stdout.write(new Array(lengths[lengths.length - 1] + 2 * space).fill(main).join('') + right + '\n');
}

/**
 * Prints row of table
 * @param {Array}  arrayData      - row in array format
 * @param {Array}  lengths        - lengths of columns
 * @param {String} space          - spaces between text and cell border
 * @param {String} verticalBorder - symbol of left and right borders of table
 * @param {String} vertical       - symbol of border between cells
 */
function writeTableRow(arrayData, lengths, space, verticalBorder, vertical) {
    let flag = false,
        rowCounter = 0;

    while (!flag) {
        flag = true;
        process.stdout.write(verticalBorder);
        for (let counter = 0; counter < arrayData.length - 1; counter++) {
            const text = arrayData[counter][rowCounter] || '';
            process.stdout.write(space + text + getSpace(lengths[counter] - text.length) + space + vertical);

            if (arrayData[counter][rowCounter + 1]) {
                flag = false;
            }
        }

        const text = arrayData[arrayData.length - 1][rowCounter] || '';
        process.stdout.write(space + text + getSpace(lengths[lengths.length - 1] - text.length) + space + verticalBorder + '\n');

        if (arrayData[arrayData.length - 1][rowCounter + 1]) {
            flag = false;
        }

        rowCounter++;
    }
}

/**
 * Calculates lengths of columns in percents from their enoughLengths
 * @param  {Number} width      - width of table before shrinking
 * @param  {Array}  lengths    - lengths of cells
 * @param  {Array}  minLengths - minimal lengths of cells
 * @return {Array}
 */
function getPercents(width, lengths, minLengths) {
    let deltaSum = 0,
        percentLengths = lengths.map((length, index) => {
            let delta = length - minLengths[index];
            deltaSum += delta;
            return delta;
        });

    percentLengths = percentLengths.map((length) => {
        return length / deltaSum;
    });

    return percentLengths;
}

/**
 * Fills string with given amount of spaces
 * @param  {Number} amount - amount of spaces in string
 * @return {String}
 */
function getSpace(amount) {
    if (amount <= 0) {
        return '';
    }

    return new Array(amount + 1).join(' ');
}

/**
 * Draws table in console
 */
class Table {
    /**
     * @constructor
     * @param {Array}   headers                       - array of columns headers
     * @param {Array}   data                          - array of same type objects to parse them into cell values
     * @param {Array}   [max]                         - array of max column lengths
     * @param {Array}   [min]                         - array of min column lengths
     * @param {Object}  [separators]                  - separators between cells and borders of table
     * @param {String}  [separators.vertical]         - vertical line
     * @param {String}  [separators.horizontal]       - horisontal line
     * @param {String}  [separators.horizontalBorder] - horisontal line
     * @param {String}  [separators.verticalBorder]   - vertical line
     * @param {String}  [separators.header]           - line between header and table rows
     * @param {Number}  [separators.space]            - amount of spaces between cell value and border
     * @param {Boolean} [split]                       - split or cut cell values if they are not fit cell length
     */
    constructor(headers, data, min, max, separators, split) {
        this.setData(headers, data);
        this.setMinColumnLength(min);
        this.setMaxColumnLength(max);
        this.setSeparators(separators);
        this.setSplit(split);
    }

    /**
     * Chooses split/cut mode
     * @param {Boolean} [split] - split or cut cell values if they are not fit cell length
     */
    setSplit(split) {
        this.split = split == undefined ? true : Boolean(split);
    }

    /**
     * Saves table separators
     * @param {Object} separators                            - separators between cells and borders of table
     * @param {String|Undefined} separators.vertical         - vertical line between cells
     * @param {String|Undefined} separators.horizontal       - horisontal line between rows
     * @param {String|Undefined} separators.horizontalBorder - horisontal line
     * @param {String|Undefined} separators.verticalBorder   - vertical line
     * @param {String|Undefined} separators.header           - line between header and table rows
     * @param {Number|Undefined} separators.space            - amount of spaces between cell value and border
     */
    setSeparators(separators) {
        separators = separators || {};
        this.separators = {};
        this.separators.vertical = separators.vertical !== undefined ? separators.vertical : '│';
        this.separators.horizontal = separators.horizontal !== undefined ? separators.horizontal : '';
        this.separators.verticalBorder = separators.verticalBorder !== undefined ? separators.verticalBorder : '│';
        this.separators.horizontalBorder = separators.horizontalBorder !== undefined ? separators.horizontalBorder : '─';
        this.separators.header = separators.header !== undefined ? separators.header : '─';
        this.separators.space = separators.space || 2;
        this.separators.cross = separators.cross !== undefined ? separators.cross : '┼';
        this.separators.topCross = separators.topCross !== undefined ? separators.topCross : '┬';
        this.separators.rightCross = separators.rightCross !== undefined ? separators.rightCross : '┤';
        this.separators.bottomCross = separators.bottomCross !== undefined ? separators.bottomCross : '┴';
        this.separators.leftCross = separators.leftCross !== undefined ? separators.leftCross : '├';
        this.separators.topLeft = separators.topLeft !== undefined ? separators.topLeft : '┌';
        this.separators.topRight = separators.topRight !== undefined ? separators.topRight : '┐';
        this.separators.bottomLeft = separators.bottomLeft !== undefined ? separators.bottomLeft : '└';
        this.separators.bottomRight = separators.bottomRight !== undefined ? separators.bottomRight : '┘';
    }

    /**
     * Saves max columns lengths
     * @param {Array|Undefined} max - array with max column lengths
     */
    setMaxColumnLength(max) {
        this.maxLengths = max || new Array(this.headers.length).fill(Infinity);
    }

    /**
     * Saves min columns lengths
     * @param {Array|Undefined} mix - array with min column lengths
     */
    setMinColumnLength(min) {
        this.minLengths = min || new Array(this.headers.length).fill(1);
    }

    /**
     * Saves data array, headers of new table, calculates length of columns without thinking about screen size
     * @param {Array}  headers - array of columns headers
     * @param {Array}  data    - array of same type objects to parse them into cell values
     */
    setData(headers, data) {
        for (const rowData of data) {
            for (const header of headers) {
                rowData[header] = String(rowData[header]);
            }
        }

        this.headers = headers;
        this.data = data;
        this.enoughLengths = getEnoughtLength(headers, data);
    }

    /**
     * Draws table in the console
     */
    draw() {
        let lengths = [],
            width = 0;

        for (let counter = 0; counter < this.enoughLengths.length; counter++) {
            if (this.enoughLengths[counter] > this.maxLengths[counter]) {
                lengths[counter] = this.maxLengths[counter];
            } else {
                lengths[counter] = this.enoughLengths[counter];
            }

            width += lengths[counter] + 2 * this.separators.space + 1;
        }

        if (this.separators.verticalBorder != '') {
            width += 1;
        } else {
            width -= 1;
        }

        let deltaWidth = width - process.stdout.columns;
        if (deltaWidth > 0) {
            let percentLengths = getPercents(width, lengths, this.minLengths);

            lengths = lengths.map((length, index) => {
                let delta = Math.ceil(percentLengths[index] * deltaWidth);
                width -= delta;
                return length - delta;
            });
        }

        const space = getSpace(this.separators.space),
              frame = this.separators;

        /**
         * Draws top horizontal border
         */
        if (frame.horizontalBorder) {
            fillLine(frame.horizontalBorder, frame.topCross, frame.topLeft, frame.topRight, lengths, frame.space);
        }

        /**
         * Draws header row
         */
        const arrayHeaders = this.headers.map((header, index) => parceCellData(header, lengths[index], this.split));
        writeTableRow(arrayHeaders, lengths, space, frame.verticalBorder, frame.vertical);

        /**
         * Draws header line
         */
        if (frame.header != '') {
            fillLine(frame.header, frame.cross, frame.leftCross, frame.rightCross, lengths, frame.space);
        } else if (frame.horizontal != '') {
            fillLine(frame.horizontal, width);
        }

        /**
         * Draws body of table
         */
        for (const rowData of this.data) {
            const arrayData = this.headers.map((header, index) => parceCellData(rowData[header], lengths[index], this.split));
            writeTableRow(arrayData, lengths, space, frame.verticalBorder, frame.vertical);

            if (frame.horizontal != '') {
                fillLine(frame.horizontal, frame.cross, frame.leftCross, frame.rightCross, lengths, frame.space);
            }
        }

        /**
         * Draws bottom horizontal border
         */
        if (frame.horizontalBorder) {
            fillLine(frame.horizontalBorder, frame.bottomCross, frame.bottomLeft, frame.bottomRight, lengths, frame.space);
        }
    }
};

module.exports = {
    Table
}
