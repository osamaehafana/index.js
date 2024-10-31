const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const books = [
    { ISBN: '113', title: 'Atomic Habits', author: 'James Clear', review: [], username: "jamesc" },
    { ISBN: '221', title: 'The Power of Now', author: 'Eckhart Tolle', review: [], username: "eckhart5" },
    { ISBN: '432', title: 'Think and Grow Rich', author: 'Napoleon Hill', review: [], username: "hillnap" },
    { ISBN: '531', title: 'The 7 Habits of Highly Effective People', author: 'Stephen R. Covey', review: [{ username: 'user7', rating: 5, comment: 'Essential habits for personal and professional success.' },
        { username: 'user8', rating: 4, comment: 'Practical advice that resonates deeply.' }], username: "stephencon" },
    { ISBN: '455', title: 'Outwitting the Devil', author: 'Napoleon Hill', review: [], username: "hillnap" }

];

// Task 1: Get the book list available in the shop
app.get('/books', (req, res) => {
    res.json(books);
});

// Task 2: Get the books based on ISBN
app.get('/books/isbn/:isbn', (req, res) => {
    const book = books.find(b => b.ISBN === req.params.isbn);
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
});

// Task 3: Get all books by Author
app.get('/books/author/:author', (req, res) => {
    const authorBooks = books.filter(b => b.author.toLowerCase() === req.params.author.toLowerCase());
    if (authorBooks.length === 0) return res.status(404).send('No books found for this author');
    res.json(authorBooks);
});

// Task 4: Get all books based on Title
app.get('/books/title/:title', (req, res) => {
    const book = books.filter(b => b.title.toLowerCase().includes(req.params.title.toLowerCase()));
    if (book.length === 0) return res.status(404).send('No books found for this title');
    res.json(book);
});

// Task 5: Get book Review
app.get('/books/:isbn/review', (req, res) => {
    const book = books.find(b => b.ISBN === req.params.isbn);
    if (!book) return res.status(404).send('Book not found');
    res.json(book.review);
});

// Task 6: Register New user
let users = [];
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Username and password required');
    const userExists = users.find(user => user.username === username);
    if (userExists) return res.status(400).send('User already exists');
    users.push({ username, password });
    res.send('User registered successfully');
});

// Task 7: Login as a Registered user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(400).send('Invalid credentials');
    res.send('Login successful');
});

// Task 8: Add/Modify a book review (only for registered users)
app.post('/books/:isbn/review', (req, res) => {
    const { username, review } = req.body;
    if (!username || !review) return res.status(400).send('Username and review required');
    const book = books.find(b => b.ISBN === req.params.isbn);
    if (!book) return res.status(404).send('Book not found');
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).send('Unauthorized user');
    book.review.push({ username, review });
    res.send('Review added');
});

// Task 9: Delete book review added by a particular user
app.delete('/books/:isbn/review', (req, res) => {
    const { username } = req.body;
    const book = books.find(b => b.ISBN === req.params.isbn);
    if (!book) return res.status(404).send('Book not found');
    const user = users.find(u => u.username === username);
    if (!user) return res.status(401).send('Unauthorized user');
    book.review = book.review.filter(r => r.username !== username);
    res.send('Review deleted');
});

// Task 10: Get all books (using async callback function)
function getBooksAsync(callback) {
    setTimeout(() => {
        callback(null, books);
    }, 1000);
}

app.get('/async/books', (req, res) => {
    getBooksAsync((err, data) => {
        if (err) return res.status(500).send('Error fetching books');
        res.json(data);
    });
});

// Task 11: Search by ISBN (using Promises)
app.get('/promise/books/isbn/:isbn', (req, res) => {
    const findBookByISBN = isbn => {
        return new Promise((resolve, reject) => {
            const book = books.find(b => b.ISBN === isbn);
            if (!book) return reject('Book not found');
            resolve(book);
        });
    };

    findBookByISBN(req.params.isbn)
        .then(book => res.json(book))
        .catch(err => res.status(404).send(err));
});

// Task 12: Search by Author
app.get('/promise/books/author/:author', (req, res) => {
    const findBooksByAuthor = author => {
        return new Promise((resolve, reject) => {
            const authorBooks = books.filter(b => b.author.toLowerCase() === author.toLowerCase());
            if (authorBooks.length === 0) return reject('No books found for this author');
            resolve(authorBooks);
        });
    };

    findBooksByAuthor(req.params.author)
        .then(books => res.json(books))
        .catch(err => res.status(404).send(err));
});

// Task 13: Search by Title
app.get('/promise/books/title/:title', (req, res) => {
    const findBooksByTitle = title => {
        return new Promise((resolve, reject) => {
            const titleBooks = books.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
            if (titleBooks.length === 0) return reject('No books found for this title');
            resolve(titleBooks);
        });
    };

    findBooksByTitle(req.params.title)
        .then(books => res.json(books))
        .catch(err => res.status(404).send(err));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
