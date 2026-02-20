const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const NodeCache = require('node-cache');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize cache
const cache = new NodeCache({
  stdTTL: 0,
  useClones: false,
  deleteOnExpire: true,
  maxKeys: 1000,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize with sample books
const sampleBooks = [
  { id: uuidv4(), title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, isbn: '978-0061120084' },
  { id: uuidv4(), title: '1984', author: 'George Orwell', year: 1949, isbn: '978-0451524935' },
  { id: uuidv4(), title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, isbn: '978-0743273565' }
];

sampleBooks.forEach(book => {
  cache.set(book.id, book);
});

// Routes

// GET all books
app.get('/api/books', (req, res) => {
  const keys = cache.keys();
  const books = keys.map(key => cache.get(key));
  res.json(books);
});

// GET single book by ID
app.get('/api/books/:id', (req, res) => {
  const id = req.params.id;
  
  if (!cache.has(id)) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  const book = cache.get(id);
  res.json(book);
});

// POST create new book
app.post('/api/books', (req, res) => {
  const { title, author, year, isbn } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  
  const id = uuidv4();
  const newBook = {
    id,
    title,
    author,
    year: year ? parseInt(year) : null,
    isbn: isbn || ''
  };
  
  cache.set(id, newBook);
  res.status(201).json(newBook);
});

// PUT update book
app.put('/api/books/:id', (req, res) => {
  const id = req.params.id;
  
  if (!cache.has(id)) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  const { title, author, year, isbn } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
  
  const updatedBook = {
    id,
    title,
    author,
    year: year ? parseInt(year) : null,
    isbn: isbn || ''
  };
  
  cache.set(id, updatedBook);
  res.json(updatedBook);
});

// DELETE book
app.delete('/api/books/:id', (req, res) => {
  const id = req.params.id;
  
  if (!cache.has(id)) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  const deletedBook = cache.get(id);
  cache.del(id);
  res.json({ message: 'Book deleted successfully', book: deletedBook });
});

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server - listen on 0.0.0.0 for container environments
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
