
const { MongoClient } = require('mongodb');
const assert = require('assert')

const createGreeting = async (req, res) => {
    const { dbName, collection } = req.params
    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    });
    try {
        // TODO: connect...
        await client.connect();
        // TODO: declare 'db'
        const db = client.db(dbName);
        // We are using the 'exercises' database
        // and creating a new collection 'greetings'
        const r = await db.collection(collection).insertOne(req.body);
        assert.equal(greetings.length, r.insertedCount);
        res.status(201).json({ status: 201, data: req.body });

    }
    catch (err) {
        console.log(err.stack)
        res.status(500).json({ status: 500, data: req.body, message: err.message });

    }
    client.close();
};


const getGreeting = async (req, res) => {
    const { _id } = req.params
    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    });
    await client.connect();
    console.log('connected!');


    const db = client.db('exercise_two');
    db.collection('greetings').findOne({ _id }, (err, result) => {
        result
            ? res.status(200).json({ status: 200, _id, data: result })
            : res.status(404).json({ status: 404, _id, data: 'Not Found' });
        client.close();
    });
    console.log('disconnected!');

};

const getMoreGreetings = async (req, res) => {

    let { start, limit } = req.query;



    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    });

    let firstHalf = parseInt(start);
    let secondHalf = parseInt(start) + parseInt(limit);


    await client.connect();
    console.log('connected!');


    const db = client.db('exercise_two');
    db.collection('greetings')
        .find()
        .toArray((err, data) => {

            console.log(data.length, secondHalf)

            if (!data.length || start > data.length) {
                res.status(400)
            }
            else {
                if (secondHalf > data.length && start <= data.length) {
                    console.log('less')
                    let slicedItems = data.slice(firstHalf, data.length);
                    res.status(201).send(slicedItems)
                    client.close();
                    console.log('disconnected!');
                }
                else {
                    console.log('greater')
                    let slicedItems = data.slice(firstHalf, secondHalf);
                    console.log(slicedItems.length)
                    res.status(201).send(slicedItems)
                    client.close();
                }
            }
        })




}

module.exports = { getMoreGreetings, createGreeting, getGreeting }



