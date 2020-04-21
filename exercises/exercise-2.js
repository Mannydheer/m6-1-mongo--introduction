
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
    let totalCount = parseInt(start) + parseInt(limit);

    await client.connect();
    console.log('connected!');

    const db = client.db('exercise_two');
    db.collection('greetings')
        .find()
        .toArray((err, data) => {
            //check if start is a value greater than the array of objects we have.
            if (!data.length || start > data.length) {
                res.status(400).send({ error: err })
            }
            else if (start == undefined && limit == undefined) {
                let slicedItems = data.slice(0, 25);
                res.status(201).send(slicedItems)
            }

            else {
                //if the totalcount(limit + start) is greater than the data length and the start is less
                //if this if statement passes, then we know we need can only send back that objects that remain
                //the totalcount surpasses what we have available in db
                if (totalCount > data.length && start <= data.length) {
                    //since the total count surpasses, we need to limit to the availble objects.
                    //since we are in this if statement, the start does  not surpass, and its the total that does. 
                    let slicedItems = data.slice(firstHalf, data.length);
                    res.status(201).send(slicedItems)
                    client.close();
                    console.log('disconnected!');
                }

                else {
                    console.log('greater')
                    let slicedItems = data.slice(firstHalf, totalCount);
                    console.log(slicedItems.length)
                    res.status(201).send(slicedItems)
                    client.close();
                }
            }
        })
}

const deleteGreeting = async (req, res) => {

    const { _id } = req.params
    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    });
    // open the connection to the database server

    try {
        await client.connect();
        console.log('connected!');
        const db = client.db('exercise_two');

        const r = await db.collection('greetings').deleteOne({ _id });
        console.log(r)
        assert.equal(1, r.deletedCount)
        res.status(204).json({ status: 204, message: 'Deleted One' });
    }
    catch (err) {
        res.status(400).json({ status: 400, message: 'ERROR OCCURED', err })
    }


    // close the connection to the database server
    client.close();
    console.log('disconnected!');

}

const updateGreeting = async (req, res) => {

    const { _id } = req.params;
    const query = { _id };

    const input = { ...req.body }
    const newValues = { $set: { ...req.body } };

    //for checking if it doesnt include hello
    let allKeys = Object.keys(input)



    console.log(query, 'THIS IS QUERy')

    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    });

    try {

        console.log(newValues)


        await client.connect();
        console.log('connected!');
        const db = client.db('exercise_two');

        if (!allKeys.includes('hello')) {
            res.status(400).json({ status: 400, message: 'Does not include hello', err })
        }

        const r = await db.collection('greetings').updateOne(query, newValues);
        assert.equal(1, r.matchedCount);
        assert.equal(1, r.modifiedCount);
        res.status(204).json({ status: 204, message: 'Update One' });
    }
    catch (err) {
        res.status(400).json({ status: 400, message: 'ERROR OCCURED', err })
    }


    // close the connection to the database server
    client.close();
    console.log('disconnected!');


}

module.exports = { getMoreGreetings, createGreeting, getGreeting, deleteGreeting, updateGreeting }



