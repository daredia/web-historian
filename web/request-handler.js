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
        debugger;
        res.end();
      });
    }
    
  }    
   
    //parse out URL path. This should be a name of a site.
   
    // var site = req.url.slice(1);

    //if file is in list of URLs

    //check to see if file already exists
      //if no:
        //create a file inside archives/sites where filename = name of site (www.google.com)
        //inside file, write to file. write domain name. Ultimately html.
      //if yes:
        //grab contents of file
    //in response object, pass contents of file above.



  // res.end(archive.paths.list);
};