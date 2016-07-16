var express = require ('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Page = require('./models');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.port || 8080;

mongoose.connect('mongodb://localhost/web-historian');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongo is connected!');
});

var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('request was sent to api');
  next();
});

// access at http://localhost:8080/api/
router.get('/', function(req, res) {
  res.json({ message: 'welcome to our history items api!'});
});

router.route('/pages')
  .post(function(req, res) {
    Page.findOne( {url: req.body.url }, function(err, page) {
      if (err) {
        res.send(err);
      }
      if (page) {
        res.json(page);
      } else {
        var page = new Page();
    
        page.url = req.body.url || null;
        page.title = req.body.title || null;
        page.html = req.body.html || null;
        page.text = req.body.text || null;
        page.favicon = req.body.favicon || null;
        page.hostname = req.body.hostname || null;
        page.screenshot = req.body.screenshot || null;
        page.referrer = req.body.referrer || null;
        page.lastVisit = req.body.lastVisit || null;
        page.visits = req.body.visits || null;

        page.save(function(err) {
          if (err) {
            res.send(err);
          }
          res.json({ message: 'Page created!'} );
        });
      }
    });
  })

  .get(function(req, res) {
    Page.find(function(err, pages) {
      if (err) {
        res.send(err);
      }
      res.json(pages);
    });
  });

// register our /api routes
app.use('/api', router);

app.listen(port); 
console.log('express server listening on port', port);



