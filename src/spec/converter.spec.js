'use strict';

var converter = require('../converter');

var expect = require('chai').expect;
var fs = require('fs');
var jschardet = require('jschardet');
var path = require('path');

describe('Make sure the converter works for converting abritrary encoding files to utf8.', function () {
  it('Ensure that the converter converted the file correctly.',
    function (done) {

      var inputFile = path.resolve(__dirname, './data/The.Wire.S01E02.srt');
      var outputFile = path.resolve(__dirname, './data/The.Wire.S01E02-utf8.txt');

      // Convert the output file from simplified chinese to traditional chinese.
      converter.convert(inputFile, outputFile);

      // Read the contents
      var content = fs.readFileSync(outputFile);

      // Guess what the content should be
      var encoding = jschardet.detect(content).encoding.toLowerCase();

      // The final encoding of the file should be utf-8.
      expect(encoding).equal('utf-8');

      // Delete the output file.
      fs.unlink(outputFile, function (err) {
        expect(err).to.be.null;
        done();
      });
    });
});
