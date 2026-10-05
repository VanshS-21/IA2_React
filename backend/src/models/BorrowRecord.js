const mongoose = require('mongoose');
const { addDays, isOverdue } = require('../utils/dates');

const borrowRecordSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
  issueDate: { type: Date, default: Date.now, required: true },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, default: null },
  status: { type: String, enum: ['issued', 'returned', 'overdue'], default: 'issued' },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Librarian', required: true }
}, { timestamps: true, toJSON: { virtuals: true } });

borrowRecordSchema.pre('validate', function setDueDate(next) {
  if (!this.dueDate) this.dueDate = addDays(this.issueDate || new Date());
  next();
});
borrowRecordSchema.virtual('effectiveStatus').get(function effectiveStatus() {
  return this.status === 'issued' && isOverdue(this.dueDate) ? 'overdue' : this.status;
});
borrowRecordSchema.index({ member: 1, issueDate: -1 });
borrowRecordSchema.index({ book: 1, status: 1 });
borrowRecordSchema.index({ book: 1, member: 1 }, { unique: true, partialFilterExpression: { status: { $in: ['issued', 'overdue'] } } });
module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
