'use strict';

var _ = require('lodash');
var debug = require('debug');
var fs = require('fs');
var jschardet = require('jschardet');
var iconv = require('iconv-lite');
var path = require('path');

var converter = {};

// The maximum size used for detecting the type of encoding a file has.
// This exists because memory usage would blow up if we attempt to detect
// a file greater than couple megabytes.
converter.MAX_SIZE = 2000;

// Start the logger
var convertLogger = debug('app:converter');
var failLogger = debug('app:converter:fail');

/**
 * This function converts a given file from their original encoding into another
 * file with utf8 encoding.
 *
 * @param  {[String]} path   The path of the input file
 * @param  {[String]} output The path of the output file.
 */
converter.convert = function (input, output) {

  // Read the contents
  var content = fs.readFileSync(input);

  // Use a small buffer to sniff the type of encoding the file is using.
  var maxBufferSize = content.length;
  if(maxBufferSize > converter.MAX_SIZE) {
    maxBufferSize = converter.MAX_SIZE;
  }

  var guessBuffer = content.slice(0, maxBufferSize);

  // Guess what the content should be
  var detection = jschardet.detect(guessBuffer);

  if(_.isNull(detection) || _.isNull(detection.encoding)) {
    failLogger('Unknown file encoding ', path.basename(input));
    return;
  }

  convertLogger('Encoding: ', JSON.stringify(detection));

  var encoding = detection.encoding.toLowerCase();

  // Try decode the content in the native encoding
  var decoded = iconv.decode(content, encoding);

  // Re-encode it in utf8
  var converted = iconv.encode(decoded, 'utf8');

  // Write out the content
  fs.writeFileSync(output, converted);

  convertLogger('Converted file to utf8: ', path.basename(output));
};

module.exports = converter;
