var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        db.Article.find({})
          .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            console.log(dbArticle);
            res.render("home", {
              article: dbArticle
            });
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
          });
    });

    app.get("/scrape", function(req, res) {
        axios.get("https://thehardtimes.net/").then(function(response) {
            var $ = cheerio.load(response.data);

            $("article").each(function(i, element) {
                var result = {};
                result.headline = $(this)
                  .children(".post-header")
                  .first()
                  .first()
                  .text();

                result.summary = $(this)
                  .children(".post-content")
                  .first()
                  .text();

                result.link = $(this)
                  .children(".featured-image")
                  .children("a")
                  .attr("href");

                result.imgUrl = $(this)
                  .children(".featured-image")
                  .children("a")
                  .children("img")
                  .attr("src");
                  
                db.Article.create(result)
                  .then(function(dbArticle) {
                      console.log(dbArticle);
                  })
                  .catch(function(err) {
                    return res.json(err);
                  });
            });
            res.send("Scrape Complete");
        });
        // console.log("scrape complete!!!!!!!!!!")
    });

    app.get("/saved", function(req, res) {
        res.render("saved")
    });
};