var archive = require('../helpers/archive-helpers');
var _ = require('underscore');
// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

//Create empty array of sites to be downloaded
var toBeDownloaded = [];
//Iterate over each site in sites.txt
archive.readListOfUrls(function(sitesArray) {
  var count = 0;
  _.each(sitesArray, function(site) {
    archive.isUrlArchived(site, function(isArchived) {
      if (!isArchived) {
        toBeDownloaded.push(site);
        
      }
      count++;
      if (count === sitesArray.length) {
        archive.downloadUrls(toBeDownloaded);
      }
    });
  });
});