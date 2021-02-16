const express = require('express');
const chalk = require('chalk');
const mongoClient = require('mongodb').MongoClient;
const fetch = require('node-fetch');
const app = express();
const url = "mongodb://localhost/27017/";
const port = 3000;
const options = {
    useNewUrlParser: true, 
    useUnifiedTopology: true
};

app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json({limit: '1mb'}));
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.render('login.ejs');
})

app.get('/', (req, res) => {
    res.render('login.ejs');
})

app.post('/login', (req, res) => {
    const staff = req.body;
    mongoClient.connect(url, options, (err, client) => {        
        if (err) throw err;
        const db = client.db('bookshop');

        db.collection('staff_credentials').findOne(staff, (err, result) => {
            if (err) throw err;
            if(result) {
                console.log(chalk.cyan(`login successful: ${result.username}, ${result.password}`));
                res.redirect('/cms');
            }
            else console.log(chalk.red('Incorrect credentials'));
        })
    })
})

app.get('/cms', (req, res) => {
    res.render('cms.ejs');
})

app.get('/add_book', (req, res) => {
    res.render('add_book.ejs');
})

app.post('/add_book', (req, res) => {
    const item = req.body;
    mongoClient.connect(url, options, (err, client) => {
        if (err) throw err;
        const db = client.db('bookshop');
        db.collection('product').insertOne(item, (err, msg) => {
            if (err) throw err;
            console.log(chalk.cyan('One Document inserted!'));
            client.close();
        })
    })
})

app.get('/search_book', (req, res) => {
    res.render('search_book.ejs');
})

app.post('/search_book', (req, res) => {
    const item = req.body;
    mongoClient.connect(url, options, (err, client) => {
        if (err) throw err;
        const db = client.db('bookshop');
        db.collection('product').findOne(item, (err, result) => {
            if (err) throw err;
            console.log(chalk.magenta(result));
            client.close();
        })
    })
})

app.get('/view_books', (req, res) => {
    res.render('view_books.ejs');
})

app.get('/update_book_details', (req, res) => {
    res.render('update_book_details.ejs');
})

app.post('/update_book_details', (req, res) => {
    const book = req.body;
    const item = {
        title: book.title
    };
    const updatedValues = {
        $set: {
            title: book.updatedTitle,
            author: book.updatedAuthor,
            category: book.updatedCategory,
            genre: book.updatedGenre,
            quantity: book.updatedQuantity
        }
    }
    mongoClient.connect(url, options, (err, client) => {
        if (err) throw err;
        const db = client.db('bookshop');
        db.collection('product').updateOne(item, updatedValues, (err, msg) => {
            if (err) throw err;
            console.log(chalk.cyan('One document updated successfully!'));
            client.close();
        })
    })
})

app.get('/remove_book', (req, res) => {
    res.render('remove_book.ejs');
})

app.post('/remove_book', (req, res) => {
    const item = req.body;
    mongoClient.connect(url, options, (err, client) => {
        if (err) throw err;
        const db = client.db('bookshop');
        db.collection('product').removeOne(item, (err, result) => {
            if (err) throw err;
            console.log(chalk.magenta("One item removed successfully"));
            client.close();
        })
    })
})

app.listen(port, console.log(chalk.magenta(`listening on port ${port}`)));