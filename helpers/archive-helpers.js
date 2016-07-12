var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var https = require('https');
var urlParser = require('url');

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
  console.log('Inside downloadUrls');
  _.each(urlArray, function(url) {
    var urlObj = urlParser.parse('http://' + url);
    // make GET request to url
    var req = https.request(
      {
        host: urlObj.host,
        path: urlObj.path,
        rejectUnauthorized: false // TODO: undo this and address properly before productionalizing
      },
      function(response) {
        console.log('url being downloaded: ', url);
        var str = '';
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
          str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
          // console.log(str);
          // write to file
          var filePath = exports.paths.archivedSites + '/' + encodeURIComponent(urlObj.host + urlObj.path);
          fs.writeFile(filePath, str, function(err) {
            if (err) {
              throw err;
            }
            console.log('write html to file is done');
          });          
        });
      });

    req.on('error', function(e) {
      console.log('e.message:', e.message, urlObj);
    });

    req.end();
    // create a new file populated with the response body
  });
};

exports.searchFiles = function(query, cb) {
  var matchingFiles = [];
  fs.readdir(exports.paths.archivedSites, function(err, files) {
    var count = 0;
    files.forEach(function(file) { 
      fs.readFile(exports.paths.archivedSites + '/' + file, 'utf-8', function(err, contents) { 
        if (err) {
          throw err;
        } else {
          if (contents.toLowerCase().indexOf(query) !== -1) { // if file contains query
            matchingFiles.push(decodeURIComponent(file));
          }  
        }
        count++;
        if (count === files.length) {
          cb(matchingFiles);
        }
      }); 
    });
  });
};





