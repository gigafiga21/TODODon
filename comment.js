/**
 * Cuts TODO and initial signs from comment
 * @param  {String} comment - given comment
 * @return {String}
 */
function cutTODO(comment)
{
    const regexp = /^\/\/[\t ]*TODO ?:? */ig;
    regexp.exec(comment);
    return comment.slice(regexp.lastIndex);
}

/**
 * Founds amount of exclamations
 * @param  {String} comment - string to search exclamations
 * @return {Number}         - importance (amount of exclamations)
 */
function getImportance(comment) {
    let lastIndex = comment.indexOf('!', 0),
        exclamationsAmount = 0;

    while (lastIndex != -1 && lastIndex < comment.length) {
        lastIndex++;
        exclamationsAmount++;
        lastIndex = comment.indexOf('!', lastIndex);
    }

    return exclamationsAmount;
}

/**
 * Founds username in given TODO comment
 * @param  {String} comment - string to search username
 * @return {String}         - found name (if comment is anonymous then '')
 */
function getUsername(comment) {
    let separatorIndex = comment.indexOf(';');

    if (separatorIndex == -1) {
        return '';
    }

    return comment.slice(0, separatorIndex);
}

/**
 * Founds date in given TODO comment
 * @param  {String} comment - string to search date
 * @return {String}         - found date in string format, '' if not given
 */
function getDate(comment) {
    const date = /; ?[\d-]*;/ig.exec(comment);
    if (date == null ) {
        return '';
    }

    const firstDigit = /\d/ig.exec(date[0]);
    if (firstDigit == null) {
        return '';
    }

    return date[0].slice(firstDigit.index, date[0].length - 1);
}

/**
 * Cutts off text from non-parced comment
 * @param  {String} commment - string to cutt text of comment out
 * @return {String}          - cutted text
 */
function getText(comment) {
    let separatorIndex = comment.lastIndexOf(';');

    return comment.slice(separatorIndex + 1).trim();
}

/**
 * Class of the commentary
 * @prop {String} user       - username of the TODO comment author, null if not given
 * @prop {Object} date       - date of the TODO comment, null if not given
 * @prop {Number} importance - level of importance of the TODO comment
 * @prop {String} file       - name of file where TODO comment was found
 * @prop {String} text       - text of the TODO comment
 */
class Comment {
    /**
     * Parse given comment string to user, data, importance and text, saves name of file where comment was found
     * @constructor
     * @param {String} comment - not parsed comment
     * @param {String} file    - name of file where TODO comment was found
     */
    constructor(comment, file) {
        comment = cutTODO(comment);

        this.importance = getImportance(comment);
        this.user       = getUsername(comment);
        this.date       = getDate(comment);
        this.text       = getText(comment);
        this.file       = file;
    }
}

module.exports = {
    Comment
}
