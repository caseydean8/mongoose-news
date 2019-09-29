const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
const ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },

  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },

  date: {
      type: String
  },

  summary: {
      type: String
  },

  // comment is an object that stores a Comment id
  comment: [
    {
    type: Schema.Types.ObjectId,
    // The ref option is what tells Mongoose which model to use during population
    ref: "Comments"
  }
]
});

// This creates our model from the above schema, using mongoose's model method
const Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;