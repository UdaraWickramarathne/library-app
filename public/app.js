const API_URL = 'http://localhost:3001/api/books';

let isEditMode = false;
let currentEditId = null;

// DOM elements
const bookForm = document.getElementById('book-form');
const booksContainer = document.getElementById('books-container');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    
    bookForm.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', resetForm);
});

// Load all books
async function loadBooks() {
    try {
        const response = await fetch(API_URL);
        const books = await response.json();
        
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
        booksContainer.innerHTML = '<div class="loading">Error loading books. Please try again.</div>';
    }
}

// Display books in the UI
function displayBooks(books) {
    if (books.length === 0) {
        booksContainer.innerHTML = `
            <div class="empty-state">
                <p>📚 No books in the library yet.</p>
                <p>Add your first book using the form!</p>
            </div>
        `;
        return;
    }
    
    booksContainer.innerHTML = books.map(book => `
        <div class="book-card">
            <h3>${escapeHtml(book.title)}</h3>
            <div class="book-author">by ${escapeHtml(book.author)}</div>
            <div class="book-details">
                ${book.year ? `Published: ${book.year}` : ''}
                ${book.isbn ? ` | ISBN: ${escapeHtml(book.isbn)}` : ''}
            </div>
            <div class="book-actions">
                <button class="btn btn-edit" onclick="editBook(${book.id})">Edit</button>
                <button class="btn btn-delete" onclick="deleteBook(${book.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();
    
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        year: document.getElementById('year').value || null,
        isbn: document.getElementById('isbn').value
    };
    
    try {
        if (isEditMode) {
            await updateBook(currentEditId, bookData);
        } else {
            await createBook(bookData);
        }
        
        resetForm();
        loadBooks();
    } catch (error) {
        console.error('Error saving book:', error);
        alert('Error saving book. Please try again.');
    }
}

// Create new book
async function createBook(bookData) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to create book');
    }
    
    return response.json();
}

// Update existing book
async function updateBook(id, bookData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
    });
    
    if (!response.ok) {
        throw new Error('Failed to update book');
    }
    
    return response.json();
}

// Edit book
async function editBook(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const book = await response.json();
        
        document.getElementById('book-id').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('year').value = book.year || '';
        document.getElementById('isbn').value = book.isbn || '';
        
        isEditMode = true;
        currentEditId = id;
        formTitle.textContent = 'Edit Book';
        submitBtn.textContent = 'Update Book';
        cancelBtn.style.display = 'block';
        
        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error loading book:', error);
        alert('Error loading book. Please try again.');
    }
}

// Delete book
async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete book');
        }
        
        loadBooks();
    } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting book. Please try again.');
    }
}

// Reset form
function resetForm() {
    bookForm.reset();
    document.getElementById('book-id').value = '';
    isEditMode = false;
    currentEditId = null;
    formTitle.textContent = 'Add New Book';
    submitBtn.textContent = 'Add Book';
    cancelBtn.style.display = 'none';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
