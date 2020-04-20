
const { MongoClient } = require('mongodb');

const getCollection = async (req, res) => {

    console.log('INSIDE')
    const { dbName, collection } = req.params

    console.log(dbName, collection)


    const client = new MongoClient('mongodb://localhost:27017', {
        useUnifiedTopology: true,
    });

    await client.connect();
    console.log('connected!');


    const db = client.db(dbName);
    db.collection(collection)
        .find()
        .toArray((err, data) => {

            console.log(data)
            if (err) {
                res.status(400)
            }
            else {
                res.status(201).send(data)
                client.close();
                console.log('disconnected!');
            }
        })
};

module.exports = { getCollection }



