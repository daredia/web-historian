var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // check if request is a GET

  
  if (req.method === 'GET') {
    var myPath = archive.paths.siteAssets;
    if ( req.url === '/') {
      myPath = myPath + '/index.html';

      fs.readFile(myPath, function (err, html) {
        if (err) {
          throw err; 
        }
        res.writeHead(200, helpers.headers);
        res.write(html);
        res.end();
      });
    } else if ( req.url === '/styles.css' ) {
      myPath = myPath + '/styles.css';

      fs.readFile(myPath, function (err, data) {
        if (err) {
          throw err; 
        }
        // helpers.headers['Content-Type'] = 'text/css';
        res.writeHead(200, helpers.headers);
        res.write(data);
        // debugger;
        res.end();
      });
    } else if ( req.url.includes('jquery.js') ) {
      myPath = myPath + '/bower_components/jquery/dist/jquery.js';

      fs.readFile(myPath, function (err, data) {
        if (err) {
          throw err; 
        }
        // helpers.headers['Content-Type'] = 'text/css';
        res.writeHead(200, helpers.headers);
        res.write(data);
        res.end();
      });
    } else {
      //parse out URL path. This should be a name of a site.
      myPath = archive.paths.archivedSites + req.url;
      
      //grab contents of file and write back to response body
      var url = req.url.slice(1);

      archive.isUrlArchived(url, function(exists) {
        if (exists) {
          //do something
          fs.readFile(myPath, function (err, data) {
            if (err) {
              throw err; 
            }
            res.writeHead(200, helpers.headers);
            //in response object, pass contents of file above.
            res.write(data);
            res.end();  
          });      
        } else {
          res.writeHead(404, helpers.headers);
          //in response object, pass contents of file above.
          res.end();
        }
      });
    }
  } else if ( req.method === 'POST') {
    // request body will be a string containing a url 
    console.log('Post request received');
    var str = '';
    //another chunk of data has been recieved, so append it to `str`
    req.on('data', function (chunk) {
      str += chunk;
    });


    //the whole response has been recieved, so we just print it out here
    req.on('end', function () {
      // once streaming of data is done, we'll have a stringified object
      // grab url property of that object
      var url = str.slice(4);
      // pass that url into below helper
      // check to see if url is NOT in the list (helper method)
      archive.isUrlInList(url, function(exists) {
        if (!exists) {
          archive.addUrlToList(url, function() {
            // respond to user with 302
            res.writeHead(200, helpers.headers);
            res.end();
          });
        }
      });
    });

    
      // if true, append url and \n to list

      // TODO: if already archived, redirect user to /sitename 
        // which will write response with site's html
        // else, respond with loading.html
  }
};
