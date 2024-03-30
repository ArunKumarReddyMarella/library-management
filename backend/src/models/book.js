const { model, Schema } = require("mongoose");

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = model("Counter", counterSchema);

const bookSchema = new Schema({
  // id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  author: { type: String, required: true },
  synopsis: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  borrowedBy: [{ type: Schema.Types.ObjectId, ref: "users" }],
  priceHistory: { type: Array, required: true, default: [] },
  quantityHistory: { type: Array, required: true, default: [] },
  image: { type: String },
  subtitle: { type: String },
  aboutAuthor: { type: String },
});

bookSchema.statics.getNextSequenceValue = async function (modelName) {
  const counter = await Counter.findOneAndUpdate(
    { _id: modelName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

const BookModel = model("books", bookSchema);

module.exports = { BookModel };