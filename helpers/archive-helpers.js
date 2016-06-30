var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  //read sites.txt file. will call callback
  fs.readFile(exports.paths.list, 'utf-8', function(err, data) {

    if (err) {
      throw err;
    }
  //parse contents
    callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  var result;
  exports.readListOfUrls(function(urlArray) {
    if ( _.indexOf(urlArray, url) === -1) {
      result = false;
    } else {
      result = true;
    }
    callback(result);
  });
};

exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function (err) {
    if (err) {
      throw err;
    }
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  // input: url and callback
  // output: boolean
  // side effect: call callback
  var result;
  // check archives/sites to see if a file with the name of url exists
  var filePath = exports.paths.archivedSites + '/' + url;
  fs.access(filePath, fs.F_OK, function(err) {
    if (!err) {
      result = true;

    } else {
      result = false;
    }
    callback(result);
  });
};

exports.downloadUrls = function(urlArray) {
  // input: array of urls
  // side effect: downloads html for each url in array, unconditionally
  _.each(urlArray, function(url) {
    // make GET request to url
    http.request(
      {
        host: url
      },
      function(response) {
        var str = '';
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
          str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
          console.log(str);
          // write to file
          var filePath = exports.paths.archivedSites + '/' + url;
          fs.writeFile(filePath, str, function(err) {
            if (err) {
              throw err;
            }
            console.log('write html to file is done');
          });          
        });
      }).end();
    // create a new file populated with the response body
  });
};

// TODO: add another site to the test file to see if it handles new sites




