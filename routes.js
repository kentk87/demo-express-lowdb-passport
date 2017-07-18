var router = require('express').Router();
var low = require('lowdb');
var path = require('path');
var uuid = require('uuid');
var authService = require('./services/authService');

// connect to database
// path.join will take the parameters and create a path using the
// right type of slashes (\ vs /) based on the operatin system
var db = low(path.join('data', 'db.json'));

//==========================
// root route
//==========================

// display home page
router.get('/', function(req, res) {
  res.render('home')
})

//==========================
// book routes
//==========================

// display all books
router.get('/books', function(req, res) {
  var books = db.get('books').value()
  var authors = db.get('authors').value()

  res.render('books', { books: books, authors: authors })
})

// create a new book
router.post('/createBook', function(req, res) {
  // get data from form
  var title = req.body.title;
  var author_id = req.body.author_id;

  // insert new book into database
  db.get('books')
    .push({title: title, id: uuid(), author_id: author_id})
    .write()

  // redirect
  res.redirect('/books')
})

// display one book
router.get('/books/:id', function(req, res) {
  var book = db.get('books').find({ id: req.params.id }).value()
  var author;
  if(book) {
    author = db.get('authors').find({ id: book.author_id }).value()
  }

  res.render('book', { book: book || {}, author: author || {}})
})

module.exports = router;