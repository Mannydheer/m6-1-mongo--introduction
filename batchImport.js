const fs = require('file-system');
const { MongoClient } = require('mongodb');
const assert = require('assert')


//should it be in the async?
const greetings = JSON.parse(fs.readFileSync('data/greetings.json'));

//dont need req and res
const batchImport = async (req, res) => {
    //wtv the database name is and the name of the collection
    const { dbName, collection } = req.params
    console.log(greetings.length)
    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        const db = client.db(dbName);
        const r = await db.collection(collection).insertMany(greetings);

        //double check greetings.length
        assert.equal(greetings.length, r.insertedCount);
        res.status(201).json({ status: 201, data: greetings });
    }
    catch (err) {
        console.log(err.stack)
        res.status(500).json({ status: 500, data: greetings, message: err.message })
    }
    client.close();


}


module.exports = { batchImport }

