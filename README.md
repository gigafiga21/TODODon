# TODODON
Named from TODO done. Simple command line tool to search and sort your TODO comments (later not only in JS files).

### Comment structure
Here is the basic comment structure this utility operates:  
`// TODO <author>; <date>; <text>`  
You may use `\t` or `\s` character between `//` and `TODO` in any amounts. Between `;` and `<smth>` you may use 0-1 `\s` character. If you 
do not use author and date fields both you may insert `;;` or not:

    // TODO this is comment with empty fields
    // TODO ;; this is comment with empty fields

If you do not use only one field you must insert `;` after each:

    // TODO <author>;; this is comment without date
    // TODO ;<date>; this is comment without author

Field date consists of year, month and day in this order:  `yyyy[-mm[-dd]]`, where year is obligatory. It is not possible to use only year and day. 
Examples with all possible date variants:

    // TODO <author>;2018; this is comment with author and year
    // TODO ;2018-06; this is comment without author, but with year and month
    // TODO ;2018-06-01; this is comment without author, but with year, month and day

### Executing
To run use file `bin/tododon.js`:  
`node tododon.js <command> <flags>`

### Available commands
`show` - shows all found TODO comments  
`important` - shows only important (with exclamation marks) TODO  
`user <username>` - shows comments only from given user, this command is not registersensible; you may not end username;  
`date <year>[-<month>-<day>]` - shows TODO comments after given date  
`sort importance|date|user` - sorts TODO by amount of exclamations, date or groups by users

### Available flags
`-nocut` - draws table with full text in cells  
`-ignore=<ignore_list>` - sets file/dir masks for paths where search will not be executed. Masks must be divided with ';' character.  
`-target=<target_path>` - sets path to the directory where search will start. May be relative or absolute.

### Masks
`-ignore` flag uses masks to ignore files and dirs. There are only 2 service characters available: `*` (here is strings with any length with 
any symbols) and `?` (here is any character).

### Examples
For the file structure given below and current location in `/proj/bin`:

    /proj ┬ /build ─ bin.js
          ├ /node_modules ─ ...
          ├ /.git ─ ...
          ├ index.js
          └ webpack.config.js

`tododon <command>` - will process all TODO comments in `bin.js`  
`tododon <command> -target=../` - will process all TODO comments in files contained in `/proj` dir and in its subdirs  
`tododon <command> -target=../ -ignore=node_modules` - like the previous one, but everything in `node_modules` will be ignored
`tododon <command> -target=../ -ignore=node_modules;.git` - ignoring `node_modules` and `.git` dirs
