const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentsSchema object
// This is similar to a Sequelize model
const CommentsSchema = new Schema({
  // `title` is of type String
//   title: String,
  // `body` is of type String
  body: String
});

// This creates our model from the above schema, using mongoose's model method
const Comments = mongoose.model("Comments", CommentsSchema);

// Export the Comments model
module.exports = Comments;