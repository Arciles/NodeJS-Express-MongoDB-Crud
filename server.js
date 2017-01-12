console.log('May Node be with you')
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

var db;
MongoClient.connect('mongodb://admin:Password123@ds151078.mlab.com:51078/star-wars-quotes', (err, database) => {
  if (err) return console.log(err)
    db = database;
    app.listen(3000);
});

// THIS handles GET Requtest
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray((err, results) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: results});
    //res.end();
  });
});

// This handles POST request
app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
});

// This handles PUT request
app.put('/quotes', (req, res) => {
  db.collection('quotes')
  .findOneAndUpdate(
    {
      name: 'Yoda'
    },
    {
      $set: {
        name: req.body.name,
        quote: req.body.quote
      }
    },
    {
      sort: {_id: -1},
      upsert: true
    },
    (err, result) => {
      if (err) return res.send(err)
      res.send(result)
  });
});

// This handles DELETE request
app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send('A darth vadar quote got deleted')
  })
})
