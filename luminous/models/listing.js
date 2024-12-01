const { Schema, model } = require("mongoose");
const Review = require("./review.js");

const listingSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is Required!"],
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price can't be negetive!"],
    },
    location: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
      filename: {
        type: String,
        required: true,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing.reviews.length) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

listingSchema.pre("deleteMany", async () => {
  const result = await Review.deleteMany({});
  console.log(result);
});

const Listing = model("Listing", listingSchema);

module.exports = Listing;
