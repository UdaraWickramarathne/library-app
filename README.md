# Library Management System

A simple CRUD application for managing a library book collection built with Node.js, Express.js, and vanilla JavaScript.

## Features

- ✅ Create new books
- ✅ Read/View all books
- ✅ Update existing books
- ✅ Delete books
- ✅ Simple and responsive UI
- ✅ In-memory data storage

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Navigate to the project directory:
```bash
cd library-app
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start the server:
```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:3001
```

## Docker Support

Build and run with Docker:

```bash
# Build the image
docker build -t library-app .

# Run the container
docker run -p 3001:3001 library-app
```

## API Endpoints

Full API documentation is available in [openapi.yaml](openapi.yaml)

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

## Project Structure

```
library-app/
├── server.js           # Express server and API routes
├── package.json        # Project dependencies
├── openapi.yaml        # OpenAPI 3.0 specification
├── Dockerfile          # Docker configuration
├── .dockerignore       # Docker ignore file
├── .gitignore         # Git ignore file
├── README.md          # Project documentation
└── public/            # Frontend files
    ├── index.html     # Main HTML page
    ├── style.css      # Styles
    └── app.js         # Frontend JavaScript
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data Storage**: In-memory (array)

## Notes

- This app uses in-memory storage, so data will be lost when the server restarts
- For production use, consider integrating a database like MongoDB, PostgreSQL, or MySQL
