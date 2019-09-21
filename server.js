// Parses HTML to find elements
const cheerio = require("cheerio");

// Makes HTTP request for HTML page
const axios = require("axios");

// First, tell the console what server.js is doing
console.log("*** ENGAGE WIKILEAKS SCRAPETRON ***");

// Making a request via axios for reddit's "webdev" board. The page's HTML is passed as the callback's third argument

// axios request for wikileaks news page
axios.get("https://wikileaks.org/-News-.html").then((response)=> {

  // Load the HTML into cheerio and save it to a const variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  const $ = cheerio.load(response.data);

  const results = [];

  $("li").each((i, element) => {

    const title = $(element).children(".title").text();

    const link = $(element).children().find("a").attr("href");

    const date = $(element).children(".timestamp").text().trim();


    const summary = $(element).children().find("p").text().trim();
    
    results.push({ title, link, date, summary });
  });

  console.log(results);
});
