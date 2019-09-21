var express = require("express");
var mongojs = require("mongojs");

// Parses HTML to find elements
const cheerio = require("cheerio");

// Makes HTTP request for HTML page
const axios = require("axios");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "wiki-scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Retrieve data from the db
app.get("/", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.scrapedData.find({}, function(error, found) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        res.json(found);
      }
    });
  });



  app.get("/scrape", function(req, res) {
// lmk what server.js is up to
    console.log("*** ENGAGE WIKILEAKS SCRAPETRON ***");
// axios request for wikileaks news page
    axios.get("https://wikileaks.org/-News-.html").then((response)=> {

  // Load the HTML into cheerio and save it to a const variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    const $ = cheerio.load(response.data);


        $("li").each((i, element) => {

            const title = $(element).children(".title").text();

            const link = $(element).children().find("a").attr("href");

            const date = $(element).children(".timestamp").text().trim();

            const summary = $(element).children().find("p").text().trim();

            db.scrapedData.insert({
                title,
                link,
                date,
                summary
            },
            function(err, inserted) {
                if (err) {
                    console.log(err);
                } 
                else {
                    console.log(inserted);
                }
            });
        });
    res.send("scrape complete")
    });
});

app.listen(3000, function() {
    console.log("App running on port 3000!");
  });