const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;

console.log(process.env.DB_USER);

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vgg4u.mongodb.net/jobPortal?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const employerCollection = client.db("jobPortal").collection("employer");
    const postCollection = client.db("jobPortal").collection("jobPost");
    const adminCollection = client.db("jobPortal").collection("admin");
    const approvedPostCollection = client.db("jobPortal").collection("allJobs");
    const jobSeekerCollection = client.db("jobPortal").collection("jobSeeker");
    const applicationCollection = client.db("jobPortal").collection("applications");



    console.log("db connected")
    app.post('/employer', (req, res) => {
        const employerInfo = req.body
        employerCollection.insertOne(employerInfo)
        .then(result => console.log("inserted one"))
    })
    app.post('/jobSeeker', (req, res) => {
        const jobSeekerInfo = req.body
        jobSeekerCollection.insertOne(jobSeekerInfo)
        .then(result => console.log("inserted one"))
    })

    app.post('/jobPost', (req, res) => {
        const jobPostInfo = req.body
        postCollection.insertOne(jobPostInfo)
        .then(result => console.log("inserted one"))
    })

    app.post('/approvePost', (req, res) => {
        const approvePosts = req.body
        approvedPostCollection.insertOne(approvePosts)
        .then(result => console.log("inserted one"))
    })

    app.delete('/delete/:id', (req, res) => {
        postCollection.deleteOne({ _id: objectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
       })

    app.get('/checkAdmin', (req, res) => {
        adminCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/checkEmployer', (req, res) => {
        employerCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/checkJobSeeker', (req, res) => {
        jobSeekerCollection.find({email: req.query.email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    
    app.get('/pendingPost', (req, res) => {
        postCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/viewJobsPost', (req, res) => {
        approvedPostCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/apply/:id', (req, res) => {
        approvedPostCollection.find({_id: objectId(req.params.id)})
        .toArray((err, documents) => {
            res.send(documents);
        })
      })
      app.post("/application", (req, res) => {
        const applicationInfo = req.body;
        applicationCollection.insertOne(applicationInfo)
        .then(result => console.log("inserted one"))
      })
});


app.get('/', (req, res) => {
    res.send("Hello From Mega Shop Server");
})

app.listen(process.env.PORT || port)