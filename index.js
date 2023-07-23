const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// ------------------
// Express App
// ------------------
const app = express();

// ------------------
// Middleware
// ------------------
app.use(express.json());
app.use(cors());

// ---------------------------------------------------------------
// MongoDB connection
// ---------------------------------------------------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jufslxs.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    // Right your code here
    // ---------------------------------------------
    // Database connection
    // ---------------------------------------------
    const database = client.db("CollegeBookingApp");
    // ---------------------------------------------
    // MongoDB collection
    // ---------------------------------------------
    const userCollection = database.collection("users");
    const collegeCollection = database.collection("college");
    const admissionCollection = database.collection("admission");

    // ---------------------------------------------
    // POST USER
    // ---------------------------------------------
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "user already exists" });
      }

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.post("/admission", async (req, res) => {
      const userAdmission = req.body;
      const result = await userCollection.insertOne(userAdmission);
      res.send(result);
    });

    // ----------------------------------------------------
    // GET Request
    // ----------------------------------------------------
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get("/college", async (req, res) => {
      const result = await collegeCollection.find().toArray();
      res.send(result);
    });

    app.get("/admission", async (req, res) => {
      const result = await admissionCollection.find().toArray();
      res.send(result);
    });

    app.get("/college/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collegeCollection.findOne(query);

      if (!query) {
        return res.status(404).json({ message: "College not found" });
      }

      res.send(result);
    });

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
  res.send("Server route");
});

// -----------------------------------
// Port
// -----------------------------------
const port = process.env.PORT || 5000;

// ----------------------------------------
// Run Server : nodemon index or node index
// ----------------------------------------
app.listen(port, () => {
  console.log(`Server run on ${port}...`);
});
