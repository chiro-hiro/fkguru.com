'use strict';
const path = require('path');
const fs = require('fs');
var colors = require('colors/safe');

const std = {
  fatal: (v) => { process.stderr.write(`${colors.red('[FATAL]')} ${v}\n`); process.exit(1); },
  err: (v) => process.stderr.write(`${colors.red('[ERR]')} ${v}\n`),
  warn: (v) => process.stderr.write(`${colors.yellow('[WARN]')} ${v}\n`),
  info: (v) => process.stdout.write(`${colors.green('[INFO]')} ${v}\n`),
};

var fp = {
  std: std,
  colors: colors
};

fp.scanDir = function (scanPath, regex, filelist) {
  if (!filelist) var filelist = filelist || [];
  if (!regex) var regex = regex || /.+/;
  if (!fs.existsSync(scanPath)) std.fatal(`Scan path "${scanPath}" is not existing`);

  var dirs = fs.readdirSync(scanPath);
  for (var i = 0; i < dirs.length; i++) {
    var _childPath = path.resolve(scanPath, dirs[i])
    if (fs.statSync(_childPath).isDirectory()) {
      fp.scanDir(_childPath, regex, filelist);
    } else {
      filelist.push(_childPath);
    }
  }
  return filelist.filter((i) => regex.test(i));
}

fp.generateID = function (value) {
  return value.replace(/[^a-z\n\ 0-9]/gi, '').replace(/\ /g, '-').toLowerCase();
}


module.exports = fp;
