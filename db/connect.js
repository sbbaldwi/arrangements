const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const initDb = (callback) => {
    if (_db) {
        console.log('Db is already initialized!');
        return callback(null, _db);
    }
    MongoClient.connect(process.env.CONNECTION_STRING)
        .then((client) => {
            _db = client.db('accounts'); // Call db() to get the database object
            callback(null, _db);
        })
        .catch((err) => {
            callback(err);
        });
};

const getDb = () => {
    if (!_db) {
        throw Error('Db not initialized');
    }
    console.log('Database object:', _db);
    return _db;
};

module.exports = {
    getDb,
    initDb
};