var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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
  //read sites.txt file. will return content.
  fs.readFile(exports.paths.list, 'utf-8', function(err, data) {

    if (err) {
      throw err;
    }
  //parse contents and return
    return callback(data.split('\n'));
  });
};

exports.isUrlInList = function(url, callback) {
  // inputs: url, callback 
  // output: callback invocation on the bool if url is in list

  var result;
  return exports.readListOfUrls(function(urlArray) {
    if ( _.indexOf(urlArray, url) === -1) {
      result = false;
    } else {
      result = true;
    }

    console.log('result value in isUrlInList: ', result);
    //returns true
    return callback(result);
  });
};

exports.addUrlToList = function(url, callback) {
  //input: URL and callback
  
  fs.appendFile(exports.paths.list, url + '\n', function (err) {
    if (err) {
      throw err;
    }
  });

  console.log('callback value inside addURLToList: ', callback());
  //returns undefined
  return callback(url);

  // exports.readListOfUrls(function(urlArray) {
  //   //do something with array
  //   urlArray.push(url);

  //   //take URL array and call join('\n') on it. 
  //   //Write contents using fs.writeFile back to filepath.

  //   callback(urlArray);
  // });
  //Effects: adds URL to the URL List, and then invokes callback on the new list.
  //read file and get array of URLs
};

exports.isUrlArchived = function() {
};

exports.downloadUrls = function() {
};
