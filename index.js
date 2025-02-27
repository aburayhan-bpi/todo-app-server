const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const moment = require("moment");

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pw1gp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );

    // Collections
    const usersCollection = client.db("todoDB").collection("users");
    const tasksCollection = client.db("todoDB").collection("tasks");

    // API's

    // save user data to db and also check if the user already exists
    app.post("/users", async (req, res) => {
      const userData = req.body;
      // console.log(userData);
      try {
        if (!userData) {
          return res.status(500).send({ message: "Users info required." });
        }

        const userQuery = { email: userData?.email };
        const isExist = await usersCollection.findOne(userQuery);

        if (isExist) {
          const currentTime = moment().format("MMMM Do YYYY, h:mm:ss a");
          const result = await usersCollection.updateOne(
            userQuery,
            { $set: { lastLoggedIn: currentTime } },
            { upsert: true }
          );

          // console.log("result from isexists", result);
          return res.send({ message: "User already exists." });
        }

        const result = await usersCollection.insertOne(userData);
        // console.log("result from insert", result);
        res.send(result);
      } catch (error) {
        // console.log(error);
        res.status(500).send({ message: "Something went wrong, try again." });
      }
    });

    // save tasks to db
    app.post("/tasks", async (req, res) => {
      const taskData = req.body;
      if (!taskData) {
        return res.status(500).send({ message: "Task data required." });
      }
      const result = await tasksCollection.insertOne(taskData);
      res.send(result);
      // console.log(taskData);
    });

    // get / fetch tasks data
    app.get("/tasks", async (req, res) => {
      const email = req.query?.email;
      
      const query = { taskUser: email || "" };
      const result = await tasksCollection.find(query).toArray();
      // console.log("user tasks: ", result);
      res.send(result);
    });

    // delete a task
    app.delete("/tasks/:id", async (req, res) => {
      const taskId = req.params.id;
      // console.log(taskId);
      const query = { id: parseInt(taskId) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });

    // update task data
    app.put("/tasks/:id", async (req, res) => {
      const taskId = req.params.id;
      const newCategory = req.query.category;
      const updatedTask = req.body;
      const currentTime = moment().utc().format();
      const query = { id: parseInt(taskId) };

      // Create an object to store fields that need to be updated
      const updateObj = {};

      if (newCategory) {
        updateObj.category = newCategory;
        updateObj.timestamp = currentTime;
      }

      if (updatedTask) {
        // Only set values if they exist
        if (updatedTask.title) updateObj.title = updatedTask.title;
        if (updatedTask.description)
          updateObj.description = updatedTask.description;
        if (updatedTask.category) updateObj.category = updatedTask.category;
        if (updatedTask.timestamp) updateObj.timestamp = updatedTask.timestamp;
        // updateObj.timestamp = currentTime; // Always set timestamp
      }

      // If no valid fields are provided, send an error
      if (Object.keys(updateObj).length === 0) {
        return res.status(400).send({ message: "No valid fields to update." });
      }

      try {
        // Perform the update
        const result = await tasksCollection.updateOne(query, {
          $set: updateObj,
        });
        res.send(result);
      } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).send({ message: "Failed to update task." });
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TODO server running...");
});
app.listen(port, () => {
  console.log(`TODO is running on port: `, port);
});
