const mongoose = require("mongoose");

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new CommentsSchema object
// This is similar to a Sequelize model
const CommentsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  // `body` is of type String
  comment: {
    type: String,
    required: true
  }
});

// This creates our model from the above schema, using mongoose's model method
const Comments = mongoose.model("Comments", CommentsSchema);

// Export the Comments model
module.exports = Comments;