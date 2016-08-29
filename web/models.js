// TODO: populate all these fields
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PageSchema = new Schema({
  url: String,
  title: String,
  html: String,
  text: String,
  favicon: String,
  hostname: String,
  screenshot: String,
  referrer: String,
  lastVisit: Date,
  visits: Number
}, 
  {
    timestamps: true
  });

module.exports = mongoose.model('Page', PageSchema);