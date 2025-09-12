import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    ISBN: {
      type: String,
      unique: true,
      sparse: true, // allows some docs to have no ISBN but still enforce uniqueness when present
    },
    publisher: {
      type: String,
      trim: true,
    },
    publishedDate: {
      type: Date,
    },
    edition: {
      type: String,
    },
    language: {
      type: String,
      default: "English",
    },
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
    },
    pageCount: {
      type: Number,
      min: 1,
    },
    coverImage: {
      url: String,
      altText: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    ratings: {
      average: { type: Number, min: 0, max: 5, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    versionKey: false, // optional: remove __v
  }
);

const Books = mongoose.model("Books", bookSchema);

export default Books;