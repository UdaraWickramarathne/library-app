const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory database for books
let books = [
  { id: 1, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, isbn: '978-0061120084' },
  { id: 2, title: '1984', author: 'George Orwell', year: 1949, isbn: '978-0451524935' },
  { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, isbn: '978-0743273565' }
];

let nextId = 4;

// Routes

// GET all books
app.get('/api/books', (req, res) => {
  res.json(books);
});

// GET single book by ID
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
});

// POST create new book
app.post('/api/books', (req, res) => {
  const { title, author, year, isbn } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  
  const newBook = {
    id: nextId++,
    title,
    author,
    year: year ? parseInt(year) : null,
    isbn: isbn || ''
  };
  
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT update book
app.put('/api/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  const { title, author, year, isbn } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  
  books[bookIndex] = {
    id: parseInt(req.params.id),
    title,
    author,
    year: year ? parseInt(year) : null,
    isbn: isbn || ''
  };
  
  res.json(books[bookIndex]);
});

// DELETE book
app.delete('/api/books/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  const deletedBook = books.splice(bookIndex, 1);
  res.json({ message: 'Book deleted successfully', book: deletedBook[0] });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Library app server running on http://localhost:${PORT}`);
});
