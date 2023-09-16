const express = require('express');
const mongodb = require('mongodb');
const cors = require('cors');
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const dbUrl = 'mongodb://localhost:27017/event';
const MongoClient = mongodb.MongoClient;

MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }
    const db = client.db();
    const collection = db.collection('users');
    app.post('/register', async (req, res) => {
        try {
            console.log('req on register', req?.body);
            const already = await collection.findOne({ mobile: req?.body?.mobile });
            console.log('already', already);
            if (already) {
                res.status(208).send({
                    message: "FAILED",
                    data: null,
                    error: "Already Submitted!",
                    statusCode: 208
                });
                return;
            }
            const dataToSave = await collection.insertOne({ ...req?.body, _id: new mongodb.ObjectId(), createdAt: new Date() });
            res.status(200).send({
                message: "SUCCESS",
                data: dataToSave,
                error: null,
                statusCode: 200
            });
        } catch (error) {
            res.status(500).send({
                message: "FAILED",
                data: null,
                error: error,
                statusCode: 500
            });
        }
    });
    app.post('/upload', async (req, res) => {
        try {
            const atlasUri = `mongodb+srv://spiritualbharatcom:8szpLEPILEkrdmuR@brain.ixlh0bf.mongodb.net/brain`;
            const atlasClient = new mongodb.MongoClient(atlasUri);
            await atlasClient.connect();
            console.log('Live DB Connected');
            const atlasCollection = atlasClient.db('brain').collection('eventUsers');
            // const storedTime = await localStorage.getItem("last_updated");
            // if (!storedTime)
            let storedTime = new Date(req?.body?.time);
            const cursor = await collection.find({ createdAt: { $gte: storedTime } });
            await cursor.forEach(async (doc) => {
                console.log("doc to insert", doc);
                await atlasCollection.updateOne({ _id: doc._id }, { $set: doc }, { upsert: true });
            });
            // localStorage.setItem("last_updated", new Date().toISOString());
            res.status(200).send({
                message: "SUCCESS",
                data: "dataToSave",
                error: null,
                statusCode: 200
            });
        } catch (error) {
            console.log('error while uploading', error);
            res.status(500).send({
                message: "FAILED",
                data: null,
                error: error,
                statusCode: 500
            });
        }
    })
});

app.listen(port, () => {
    console.log(`Node.js server is running on port ${port}`);
});