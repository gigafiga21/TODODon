/**
 * Finds all TODO comments by given mask
 * @param  {Array[File]} files  - array filled with multirow strings read from files
 * @param  {String}      [mask] - if "!" - searches all important comments, else - comments by author, if not given - all TODO comments
 * @return {Array[Object]}      - array of found TODO comments with path to the files they found
 */
function searchTODO(files, mask) {
    let regexp,
        found = [];

    switch (mask) {
        case undefined:
            regexp = /\/\/[\t ]*TODO ?:? *.*\n/ig;
            break;
        case '!':
            regexp = /\/\/[\t ]*TODO ?:? *[^\n]*!.*\n/ig;
            break;
        default:
            regexp = new RegExp('\/\/[\t ]*TODO ?:? *' + mask + '[^;\n]*;.*\n', 'ig');
            break;
    }

    for (const file of files) {
        let result, foundInFile = [];
        file.content += '\n';

        while (result = regexp.exec(file.content)) {
            foundInFile.push(result[0].substring(0, result[0].length - 1));
        }

        if (foundInFile.length) {
            let path = file.path.split('/');
            found.push({fileName: path[path.length - 1], comments: foundInFile});
        }
    }

    return found;
}

/**
 * Sorts array with objects by given key
 * @param  {Array[Object]} comments - array with TODO comments to sort
 * @param  {String}        key      - key of object by which values given array will be sorted
 * @return {Array[Object]}          - sorted array
 */
function sortTODO(comments, key) {
    return comments.sort((first, second) => {
        let firstLed = first[key],
            secondLed = second[key];

        if (typeof firstLed == 'string') {
            firstLed = firstLed.toLowerCase();
            secondLed = secondLed.toLowerCase();
        }

        if (firstLed > secondLed) {
            return -1;
        } else if (firstLed == secondLed) {
            return 0;
        }

        return 1;
    });
}

/**
 * Organizes (sorts and cuts) array with objects by given key and minimum value
 * @param  {Array[Object]} comments - array with TODO comments to sort
 * @param  {String}        key      - key of object by which values given array will be sorted
 * @param  {*}             min      - minimal value of key
 * @return {Array[Object]}          - sorted array
 */
function organizeTODO(comments, key, min) {
    let organized = [];

    for (const comment of comments) {
        if (comment[key] > min) {
            let counter = 0;

            while (counter < organized.length && organized[counter][key] > comment[key]) {
                counter++;
            }
            organized.splice(counter, 0, comment);
        }
    }

    return organized;
}

module.exports = {
    searchTODO,
    sortTODO,
    organizeTODO
};
