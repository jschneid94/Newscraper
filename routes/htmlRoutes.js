var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        db.Article.find({ "saved": false })
          .then(function(dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            console.log(dbArticle);
            res.render("articleList", {
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
                  .children(".post-title")
                  .children("a")
                  .text();

                result.author = $(this)
                  .children(".post-header")
                  .children(".post-byline")
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
                  
                db.Article.insertMany(result)
                  .then(function(dbArticle) {
                      console.log(dbArticle);
                  })
                  .catch(function(err) {
                    return res.json(err);
                  });
            });
            res.redirect("/");
        });
    });

    app.get("/saved", function(req, res) {
      db.Article.find({ "saved": true })
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        console.log(dbArticle);
        res.render("articleList", {
          article: dbArticle,
          saved: dbArticle.saved
        });
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
    });

    app.get("/save/:id", function(req, res) {
      let articleId = req.params.id
      db.Article.update({ "_id": articleId }, { "saved": true })
      .then(function(dbArticle) {
        res.redirect("/");
      })
      .catch(function(err) {
        res.json(err);
      });
    });

    app.get("/remove/:id", function(req, res) {
      let articleId = req.params.id
      db.Article.update({ "_id": articleId }, { "saved": false })
      .then(function(dbArticle) {
        res.redirect("/saved");
      })
      .catch(function(err) {
        res.json(err);
      });
    });

    app.get("/article/:id", function(req, res) {
      let articleId = req.params.id;
      db.Article.findOne({ "_id": articleId })
      .then(function(dbArticle) {
        res.render("articleIndiv", {
          article: dbArticle
        });
      })
      .catch(function(err) {
        res.json(err);
      });
    });

    app.get("/submit/:id", function(req, res) {
      db.Comment.create(req.body)
        .then(function(dbComment) {
          return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
        })
        .then(function(dbArticle) {
          res.render("articleIndiv", {
            article: dbArticle
          });
        })
        .catch(function(err) {
          res.json(err);
        });
    })
};