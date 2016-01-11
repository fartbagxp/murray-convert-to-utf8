'use strict';

var _ = require('lodash');
var expect = require('chai').expect;
var fs = require('fs');
var jschardet = require('jschardet');
var path = require('path');

describe('Make sure the converter can convert from GB2312 to UTF8 encoding.', function () {
  it('Ensure that the converter converted the file correctly.',
    function (done) {

      var testDir = path.resolve(__dirname, './data/');

      process.argv = ['node',
        'convert-cli.js',
        '-p',
        testDir
      ];

      require('../convert-cli');

      var outputFile = path.resolve(__dirname, './data/The.Wire.S01E02conv.srt');

      // Read the contents
      var content = fs.readFileSync(outputFile);

      // Guess what the content should be
      var encoding = jschardet.detect(content).encoding.toLowerCase();

      // The final encoding of the file should be utf-8.
      expect(encoding).equal('utf-8');

      // Read the directory for all files, make sure there's the original test files.
      var files = fs.readdirSync(testDir);
      expect(_.size(files)).equal(3);

      // Delete the output file.
      fs.unlink(outputFile, function (err) {
        expect(err).to.be.null;
        done();
      });

    });
});
