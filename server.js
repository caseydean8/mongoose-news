const express = require("express");
const mongoose = require("mongoose");
const ehb = require('express-handlebars')
const cheerio = require("cheerio");
const axios = require("axios");

// Express middleware for logging requests and responses. Used during development so you can see what requests are being made
const logger = require("morgan");

const db = require("./models");
const PORT =3000;
const app = express();

// the :status token will be colored red for server error codes,
// yellow for client error codes, cyan for redirection codes,
// and uncolored for all other codes.
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));


mongoose.connect(process.env.MONGODB_URI || "mongodb://Casey:Cdc108mlb@ds123400.mlab.com:23400/heroku_13tbmm52", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

app.engine('handlebars', ehb({ defaultLayout: 'main' }))

app.set('view engine', 'handlebars')

app.get("/", (req, res) => res.redirect("articles"))

app.get("/scrape", function(req, res) {
  console.log("*** ENGAGE WIKILEAKS SCRAPETRON ***");
  axios.get("https://wikileaks.org/-News-.html").then((response)=> {
    var $ = cheerio.load(response.data);
    $("li").each((i, element) => {
      const result = {};

      result.title = $(element).children(".title").text();

      result.link = $(element).children().find("a").attr("href");

      result.date = $(element).children(".timestamp").text().trim();

      result.summary = $(element).children().find("p").text().trim();

      db.Article.create(result)
      .then(function(dbArticle) {
        console.log(dbArticle);
        })
        .catch(function(err) {
          console.log(err)
        });
      });

    res.redirect("/articles")
    });
});

app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      let indexDisplay = { articles: dbArticle}
      res.render("index", indexDisplay);
    })
    .catch(function(err) {
      res.json(err);
    });
  });

 // Route for populating article with comments
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
  .populate("comment")
  .then(function(dbArticle) {
    // render handlebars page
    res.render("article", dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.post("/articles/:id", function(req, res) {
    console.log(req.body + " post route")
    db.Comments.create(req.body)
      .then(function(dbComments) {
        return db.Article.findOneAndUpdate({ _id: req.params.id },
          { $push: { 
            comment: dbComments._id 
          } },
          { new: true });
      })
      .then(function(dbArticle) {
        res.render("article", dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

app.delete("/articles/:id", function(req, res) {
  var myquery = { _id: req.params.id};
  db.Comments.deleteOne(myquery, function(err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
  })
  .then(function(dbArticle) {
    res.render("article", dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});