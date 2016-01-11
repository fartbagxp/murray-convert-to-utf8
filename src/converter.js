'use strict';

var fs = require('fs');
var jschardet = require('jschardet');
var iconv = require('iconv-lite');

var converter = {};

/**
 * This function converts a given file from their original encoding into another
 * file with utf8 encoding.
 * 
 * @param  {[String]} path   The path of the input file
 * @param  {[String]} output The path of the output file.
 */
converter.convert = function (path, output) {

  // Read the contents
  var content = fs.readFileSync(path);

  // Guess what the content should be
  var encoding = jschardet.detect(content).encoding.toLowerCase();

  // Try decode the content in the native encoding
  var decoded = iconv.decode(content, encoding);

  // Re-encode it in utf8
  var converted = iconv.encode(decoded, 'utf8');

  // Write out the content
  fs.writeFileSync(output, converted);
};

module.exports = converter;
