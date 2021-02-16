const mongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost/27017/";

mongoClient.connect(url, (err, client) => {
    if (err) throw err;
    const db = client.db('bookshop');
    addItem(item, db);
})

const addItem = (item, db) => {
    db.collection('prouct').insertOne(item, (err, msg) => {
        if (err) throw err;
        console.log(chalk.magenta('Item Added'));
        client.close();
    })
}