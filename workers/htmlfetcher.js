var archive = require('../helpers/archive-helpers');
var _ = require('underscore');
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

//Create empty array of sites to be downloaded
console.log('inside html fetcher');

var toBeDownloaded = [];
//Iterate over each site in sites.txt
archive.readListOfUrls(function(sitesArray) {
  _.each(sitesArray, function(site) {
    archive.isUrlArchived(site, function(isArchived) {
      if (!isArchived) {
        console.log('about to push a site into toBeDownloaded array:', site);
        //toBeDownloaded.push(site);
        archive.downloadUrls([site]);
      }
    });
  });
});

// create function called getUrlsToDownload
// that will take a callback
// the function will do lines 8-20, and then invoke the callback on the resulting array
// the callback we pass will jsut be a function that calls downloadUrls
