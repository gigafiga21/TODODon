const fs = require('fs');

/**
 * Searches all file paths by given extension
 * @param  {String} directoryPath - path to directory opened in console
 * @param  {String} extension     - extension of the file to search
 * @param  {Array}  filePaths     - array to store found paths
 * @return {Array}
 */
function getAllFilePathsWithExtension(directoryPath, extension, filePaths) {
    filePaths = filePaths || [];
    const fileNames = fs.readdirSync(directoryPath);
    for (const fileName of fileNames) {
        const filePath = directoryPath + '/' + fileName;
        if (fs.statSync(filePath).isDirectory()) {
            getAllFilePathsWithExtension(filePath, extension, filePaths);
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
    getAllFilePathsWithExtension
};
