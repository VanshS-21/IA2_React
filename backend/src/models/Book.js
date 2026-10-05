const mongoose = require('mongoose');

const validIsbn = (value) => /^(?:\d{9}[\dXx]|\d{13})$/.test(value.replace(/-/g, ''));
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 1, maxlength: 200 },
  author: { type: String, required: true, trim: true },
  isbn: { type: String, required: true, unique: true, trim: true, validate: { validator: validIsbn, message: 'ISBN must be valid ISBN-10 or ISBN-13' } },
  genre: { type: String, required: true, trim: true, index: true },
  totalCopies: { type: Number, required: true, min: 1, validate: { validator: Number.isInteger, message: 'totalCopies must be an integer' } },
  availableCopies: { type: Number, min: 0, validate: { validator(value) { return Number.isInteger(value) && value <= this.totalCopies; }, message: 'availableCopies must be an integer no greater than totalCopies' } }
}, { timestamps: true });

bookSchema.pre('validate', function setAvailable(next) {
  if (this.isNew && this.availableCopies === undefined) this.availableCopies = this.totalCopies;
  next();
});
bookSchema.index({ title: 'text' });
module.exports = mongoose.model('Book', bookSchema);
