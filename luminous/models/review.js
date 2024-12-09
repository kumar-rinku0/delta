const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    msg: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
