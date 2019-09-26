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


// // Retrieve data from the db
// app.get("/", function(req, res) {
//     // Find all results from the scrapedData collection in the db
//     db.scrapedData.find({}, function(error, found) {
//       // Throw any errors to the console
//       if (error) {
//         console.log(error);
//       }
//       // If there are no errors, send the data to the browser as json
//       else {
//         res.json(found);
//       }
//     });
//   });



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
app.get("/", function(req, res) {
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

  app.get("/comments", (req, res) => {
    res.render("comment")
  })

  // POST route for comments
  app.post("/comment", function(req, res) {
    console.log(req.body);
    // Insert the note into the notes collection
    db.Comments.insert(req.body, function(error, saved) {
      // Log any errors
      if (error) {
        console.log(error);
      }
      else {
        // Otherwise, send the note back to the browser
        // This will fire off the success function of the ajax request
        res.send(saved);
      }
    });
  });

app.listen(3000, function() {
    console.log("App running on port 3000!");
  });