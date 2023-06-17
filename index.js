const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

//midelwair
app.use(cors());
app.use(express.json());

//pass: vHrUCWGqsAIZec1w
//user: admincoffee

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfdmw9d.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    
    const CoffeeCollection = client.db("CoffeDB").collection("Coffees");

    app.post("/coffees", async (req, res) => {
      const coffee = req.body;
      console.log(coffee);
      const result = await CoffeeCollection.insertOne(coffee);
      res.send(result);
    }); 

    app.get('/coffees',async(req,res)=>{
      const coursor=CoffeeCollection.find() 
      const result =await coursor.toArray(); 
      res.send(result)
    }) 

    app.get('/coffees/:id',async(req,res)=>{
      const id=req.params.id;
      const quary={_id:new ObjectId(id)}; 
      const result=await CoffeeCollection.findOne(quary); 
      res.send(result) 
      console.log(result);
    })
    
    app.delete('/coffees/:id',async(req,res)=>{
      const id=req.params.id; 
      const quary={_id:new ObjectId(id)}
      const result=await CoffeeCollection.deleteOne(quary); 
      res.send(result)
    }) 

    app.put('/coffees/:id',async(req,res)=>{
      const id=req.params.id; 
      const coffee=req.body; 
      const filter={_id:new ObjectId(id)}; 
      const options={upsert:true}; 
      const updatecoffee={
        $set:{
           name:coffee.name,
           chef:coffee.chef,
           supplier:coffee.supplier,
           taste:coffee.taste,
           category:coffee.category,
           details:coffee.details,
           photo:coffee.photo
          } 
        }
        const result=await CoffeeCollection.updateOne(filter,updatecoffee,options);
        res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Coffe House server is running ......");
});

app.listen(port, () => {
  console.log(`Coffe House server on port ${port}`);
});
