const fs = require('fs');

/**
 * Searches all file paths by given extension
 * @param  {String} directoryPath - path to directory opened in console
 * @param  {String} extension     - extension of the file to search
 * @param  {Array}  filePaths     - array to store found paths
 * @param  {Array}  ignore        - array of path masks to be ignored
 * @return {Array}
 */
function getAllFilePathsWithExtension(directoryPath, extension, filePaths, ignore) {
    filePaths = filePaths || [];
    const fileNames = fs.readdirSync(directoryPath);
    for (const fileName of fileNames) {
        const filePath = directoryPath + '/' + fileName;
        let ignored = false;

        for (const prohibited of ignore) {
            const mask = new RegExp(directoryPath + ".*/" + prohibited + '$');
            if (mask.test(filePath)) {
                ignored = true;
                break;
            }
        }
        if (ignored) {
            continue;
        }

        if (fs.statSync(filePath).isDirectory()) {
            getAllFilePathsWithExtension(filePath, extension, filePaths, ignore);
        } else if (filePath.endsWith(`.${extension}`)) {
            filePaths.push(filePath);
        }
    }

    return filePaths;
}

/**
 * Reads file
 * @param  {String} filePath - paths to the file in file system
 * @return {String}
 */
function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

/**
 * Converts relative path into absolute one
 * @param  {String}      path - relative path
 * @return {String|Null}      - converted path or null if path is invalid
 */
function absolute(path) {
    path = (process.cwd() + '/' + path).replace(/\\/g, '/');

    let upper = path.indexOf('../');
    while (upper != -1) {
        if (upper < 3 || path[upper - 2] == ':') {
            return null;
        }

        let previous = path.lastIndexOf('/', upper - 2);
        path = path.slice(0, previous + 1) + path.slice(upper + 3);
        upper = path.indexOf('../');
    }

    return path;
}

/**
 * Saves information about file
 * @prop {String} content - content of the file
 * @prop {String} path    - path to the file
 */
class File {
    /**
     * @constructor
     * @param {String} path - path to file in OS
     */
    constructor(path) {
        this.path = path;
    }

    /**
     * Gets and saves content from the file into class instance
     */
    readin () {
        this.content = readFile(this.path);
    }
}

module.exports = {
    File,
    getAllFilePathsWithExtension,
    absolute
};
