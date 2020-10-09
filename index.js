const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
const port = 4200;

app.use(bodyParser.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jsjow.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const products = client.db("emaJohnStore").collection("products");
    const orders = client.db("emaJohnStore").collection("orders");
    
    app.post("/addProducts", (req, res) => {
        const newProducts = req.body;

        products.insertOne(newProducts)
        .then( result => {
            console.log(result.insertedCount);
            res.send( result.insertedCount )
        })
    })

    app.get('/products', (req, res) => {
        const search = req.query.search;
        products.find({name: {$regex: search}})
        .toArray( (err,documents) => {
            res.send(documents);
        })  
    })

    app.get('/product/:key', (req, res) => {
        products.find({key: req.params.key})
        .toArray( (err,documents) => {
            res.send(documents[0]);
        })  
    })

    app.post('/productsByKeys', (req, res) => {

        const productsKeys = req.body;
        products.find({key: { $in: productsKeys}})
        .toArray( (err,documents) => {
            res.send(documents);
        })
    })

    app.post("/addOrder", (req, res) => {
        const ordersInfo = req.body;
        orders.insertOne(ordersInfo)
        .then( result => {
            res.send( result.insertedCount > 0 )
        })
    })

});


app.get('/', (req, res) => {
    res.send("welcome to ema john")
})




app.listen( process.env.PORT || port);