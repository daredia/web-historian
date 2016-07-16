var express = require ('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.port || 8080;

var router = express.Router();

// access at http://localhost:8080/api/
router.get('/', function(req, res) {
  res.json({ message: 'welcome to our history items api!'});
});

app.use('/api', router);

app.listen(port); 
console.log('express server listening on port', port);