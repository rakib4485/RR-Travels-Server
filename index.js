const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efsdsdy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const packageCollection = client.db('rrTravels').collection('packages');
        const reviewCollection = client.db('rrTravels').collection('reviews');

        app.get('/packages', async (req, res) =>{
            const query = {};
            const cursor = packageCollection.find(query);
            const packages = await cursor.toArray();
            res.send(packages);
        });

        app.get('/packages/:id', async (req, res) =>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const selectedPackages = await packageCollection.findOne(query);
            res.send(selectedPackages);
        });

        app.get('/reviews', async (req,res) =>{
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.post('/reviews', async (req, res) => {
            console.log('Post API called');
            const review = req.body; 
            const result = await reviewCollection.insertOne(review);
            review._id = result.insertedId;
            res.send(review)
        })

    }
    finally{

    }
}

run().catch( () => console.log(error));



app.get('/', (req, res) => {
    res.send('RR Travels API is running')
})
app.listen(port, () => {
    console.log(`API is running on port ${port}`)
})