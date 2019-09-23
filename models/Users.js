var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var UserSchema = new Schema({
  username: {
    // `username` must be of type String
    type: String,
    // will trim whitespace
    trim: true,
    //required field and throws a custom error message if not supplied
    required: "Username is Required"
  },
  password: {
    type: String,
    trim: true,
    required: "Password is Required",
    // custom validation function to only accept values >= 6 characters
    validate: [
      function(input) {
        return input.length >= 6;
      },
      "Password should be longer."
    ]
  },
  email: {
    type: String,
    // must be unique
    unique: true,
    // must match the regex pattern below else throws a custom error message
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
    // https://www.regexbuddy.com/regex.html
  },
  // `date` must be of type Date. The default value is the current date
  userCreated: {
    type: Date,
    default: Date.now
  }
});

// This creates our model from the above schema, using mongoose's model method
var Users = mongoose.model("User", UserSchema);

// Export the User model
module.exports = Users;