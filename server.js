var express = require("express");
var mongoose = require("mongoose");
const ehb = require('express-handlebars')
const path = require("path");
// Parses HTML to find elements
const cheerio = require("cheerio");

// Makes HTTP request for HTML page
const axios = require("axios");

// Express middleware for logging requests and responses. Used during development so you can see what requests are being made
var logger = require("morgan");

var db = require("./models");

// Initialize Express
var app = express();

// hello morgan
// the :status token will be colored red for server error codes,
// yellow for client error codes, cyan for redirection codes,
// and uncolored for all other codes.
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/wiki-scraper", { useNewUrlParser: true });

// may be necessary REMOVE LATER
// app.engine('handlebars', ehb({ defaultLayout: 'main' }))

// app.set('views', path.join(__dirname + "views"));
app.engine('handlebars', ehb({ defaultLayout: 'main' }))

app.set('view engine', 'handlebars')

app.get("/", (req, res) => res.redirect("articles"))

app.get("/scrape", function(req, res) {
    // lmk what server.js is up to
    console.log("*** ENGAGE WIKILEAKS SCRAPETRON ***");
    // axios request for wikileaks news page
    axios.get("https://wikileaks.org/-News-.html").then((response)=> {

    // Load the HTML into cheerio and save it to a const variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    const $ = cheerio.load(response.data);

        $("li").each((i, element) => {
            const result = {};

            result.title = $(element).children(".title").text();

            result.link = $(element).children().find("a").attr("href");

            result.date = $(element).children(".timestamp").text().trim();

            result.summary = $(element).children().find("p").text().trim();

            db.Article.create(result)
            .then(dbArt => console.log(dbArt))
            .catch(err => console.log(err));
        });

    // res.send("scrape complete")
    res.redirect("/")
    });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        console.log(dbArticle);
        let indexDisplay = { articles: dbArticle}
        // If we were able to successfully find Articles, send them back to the client
        res.render("index", indexDisplay);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // app.get("/comment-page", (req, res) => {
  //   res.render("article")
  // })

 // Route for grabbing a specific Article by id, populate it with it's comments
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("comment")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.render("article", dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

  app.post("/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Comments.create(req.body)
      .then(function(dbComments) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComments._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });



app.listen(3000, function() {
    console.log("App running on port 3000!");
  });