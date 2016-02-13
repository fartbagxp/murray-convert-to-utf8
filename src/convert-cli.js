#!/usr/bin/env node

'use strict';

var converter = require('./converter');
var pack = require('../package');

var _ = require('lodash');
var debug = require('debug');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var program = require('commander');

// Start the logger
var convertLogger = debug('app:logger');

var cli = {};

cli.work = function () {

  // Grab the command line arguments from the user to overwrite the data.
  program
    .version(pack.version)
    .option('-f, --force', 'Overwrite the original file.')
    .option('-i, --input <path>', 'The input directory')
    .option('-o, --output <path>', 'The output directory')
    .parse(process.argv);

  var overwrite = program.force;

  // Make sure the input directory exist, if it doesn't, default to current dir
  var inDir;
  if (_.isUndefined(program.input)) {
    inDir = path.resolve('.');
  } else {
    inDir = path.resolve(program.input);
  }

  var outDir;

  // Ensure the output path is there, if it is not, create the directory.
  if (!_.isUndefined(program.output)) {
    outDir = path.resolve(program.output);
  } else {
    outDir = path.resolve('.');
  }

  convertLogger('Converting all files to utf8');
  convertLogger('Source location: ', inDir);
  convertLogger('Target location: ', outDir);

  try {
    fs.accessSync(outDir, fs.F_OK);
  } catch (e) {
    mkdirp.sync(outDir);
  }

  // Read the directory for all files ending in .srt or .txt or .csv
  var files = fs.readdirSync(inDir);

  var srts = [];
  _.forEach(files, function (f) {
    if (_.endsWith(f, '.srt') || _.endsWith(f, '.txt') || _.endsWith(f, '.csv')) {
      srts.push(f);
    }
  });

  // Convert all .srt files into utf8 encoding.
  _.forEach(srts, function (s) {
    var filepath = path.resolve(inDir, s);

    // If the overwrite flag is turned on, use the same file path for output file.
    if (overwrite) {
      converter.convert(filepath, filepath);
    } else {
      // Otherwise, include a '-utf8' string in the file.
      var extname = path.extname(s);
      var basename = path.basename(s, extname) + '-utf8' + extname;
      var newname;
      if (_.isUndefined(outDir)) {
        newname = path.resolve(inDir, basename);
      } else {
        newname = path.resolve(outDir, basename);
      }
      converter.convert(filepath, newname);
    }
  });

};

module.exports = cli;
