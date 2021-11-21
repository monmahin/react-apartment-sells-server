const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 3001;
//middlewear
app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cmtxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)

async function run() {
    try {
      await client.connect();
      const database = client.db('apartment_sells');
      const apartmentCollections = database.collection('apartments');
      const buyerCollections = database.collection('buyers');
      const userCollections = database.collection('users');
      const reviewCollections = database.collection('reviews');
      
       //GET API
       app.get('/apartments', async (req, res) => {
        const cursor = apartmentCollections.find({});
           const apartments = await cursor.toArray();
        //    console.log(apartments)
        res.json(apartments)
       })
        
         //GET SINGLE apartment
         app.get('/apartments/:id', async (req, res) => {
             const id = req.params.id;
            //  console.log(id)
            const query = { _id: ObjectId(id) };
            console.log(query)
            const apartment = await apartmentCollections.findOne(query);
            res.json(apartment);
         })
        
        //GET buyer all orders
       app.get('/buyers', async (req, res) => {
        const cursor = buyerCollections.find({});
           const buyers = await cursor.toArray();
        //    console.log(buyrs)
        res.json(buyers)
       })
        //GET all reviews 
       app.get('/reviews', async (req, res) => {
        const cursor = reviewCollections.find({});
           const reviews = await cursor.toArray();
        //    console.log(buyrs)
        res.json(reviews)
       })
        //get buyer order who is login
        app.get('/buyers', async (req, res) => {
            const email = req.query.email;
            // const date = new Date(req.query.date).toLocaleDateString();

            const query = { email: email}

            const cursor = buyerCollections.find(query);
            const buyers = await cursor.toArray();
            res.json(buyers);
        })
        //find user from database
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await userCollections.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })
        //Post buyer order
        app.post('/buyers', async (req, res) => {
            const buyer = req.body;
            const result = await buyerCollections.insertOne(buyer);
            res.send(result);
        })
        //Post buyer order
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollections.insertOne(review);
            res.send(result);
        })
        //Post apartments order
        app.post('/apartments', async (req, res) => {
            const apartment = req.body;
            console.log('post',apartment)
            const result = await apartmentCollections.insertOne(apartment);
            console.log(result)
            res.json(result);
        })
        //Post user order
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollections.insertOne(user);
            // console.log(user)
            res.json(result);
        })
        //update user order
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true }
            const updateDoc={$set:user}
            const result = await userCollections.updateOne(filter,updateDoc,options);
            // console.log(user)
            res.json(result);
        })
        //update user  as an admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put',user)
            const filter = { email: user.email }
            const updateDoc={$set:{role:'admin'}}
            const result = await userCollections.updateOne(filter,updateDoc);
            res.json(result);
        })

        app.delete('/buyers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const buyers = await buyerCollections.deleteOne(query);
            res.json(buyers);
        })
        //delete single apartment
        app.delete('/apartments/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            console.log(query)
            const apartment = await apartmentCollections.deleteOne(query);
            res.json(apartment);
        })

     
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('apartment sells!')
})

app.listen(port, () => {
    console.log(`listening at apartment port ${port}`)
}) 


 
    