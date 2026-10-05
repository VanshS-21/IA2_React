const Book = require('../models/Book');
const Member = require('../models/Member');
const BorrowRecord = require('../models/BorrowRecord');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { addDays } = require('../utils/dates');

/*
Two librarians clicking "issue" on the last copy at the same moment could both read availableCopies = 1, both pass an if (> 0) check, and both decrement, giving -1 and two loans for one copy. A read-then-write is not atomic. To prevent it, I make the check and decrement a single findOneAndUpdate({ _id, availableCopies: { $gt: 0 } }, { $inc: { availableCopies: -1 } }). MongoDB applies single-document updates atomically, so exactly one request matches; the other gets null and receives 409. If BorrowRecord creation fails, compensation increments the counter back. A min validator and partial unique index are additional safety nets.
*/
const issueBook = asyncHandler(async (req, res) => {
  const { bookId, memberId, dueDate } = req.body;
  const member = await Member.exists({ _id: memberId });
  if (!member) throw new ApiError(404, 'MEMBER_NOT_FOUND', 'Member not found');
  const book = await Book.findOneAndUpdate({ _id: bookId, availableCopies: { $gt: 0 } }, { $inc: { availableCopies: -1 } }, { new: true });
  if (!book) {
    if (!(await Book.exists({ _id: bookId }))) throw new ApiError(404, 'BOOK_NOT_FOUND', 'Book not found');
    throw new ApiError(409, 'NO_COPIES_AVAILABLE', 'No copies available');
  }
  try {
    const record = await BorrowRecord.create({ book: bookId, member: memberId, dueDate: dueDate || addDays(new Date()), issuedBy: req.user.sub });
    await record.populate([{ path: 'book' }, { path: 'member' }]);
    res.status(201).json({ success: true, data: { borrowRecord: record, availableCopies: book.availableCopies } });
  } catch (error) {
    await Book.updateOne({ _id: bookId }, { $inc: { availableCopies: 1 } });
    if (error.code === 11000) throw new ApiError(409, 'ALREADY_BORROWED', 'Member already has an active loan for this book');
    throw error;
  }
});
const returnBook = asyncHandler(async (req, res) => {
  const record = await BorrowRecord.findOneAndUpdate({ _id: req.params.borrowId, status: { $in: ['issued', 'overdue'] } }, { $set: { returnDate: new Date(), status: 'returned' } }, { new: true });
  if (!record) {
    if (!(await BorrowRecord.exists({ _id: req.params.borrowId }))) throw new ApiError(404, 'BORROW_NOT_FOUND', 'Borrow record not found');
    throw new ApiError(409, 'ALREADY_RETURNED', 'This loan has already been returned');
  }
  await Book.updateOne({ _id: record.book, $expr: { $lt: ['$availableCopies', '$totalCopies'] } }, { $inc: { availableCopies: 1 } });
  res.json({ success: true, data: { borrowRecord: record, wasLate: record.returnDate > record.dueDate } });
});
const memberHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, page, limit } = req.query;
  const member = await Member.findById(id).lean();
  if (!member) throw new ApiError(404, 'MEMBER_NOT_FOUND', 'Member not found');
  await BorrowRecord.updateMany({ member: id, status: 'issued', dueDate: { $lt: new Date() } }, { $set: { status: 'overdue' } });
  const filter = { member: id, ...(status ? { status } : {}) };
  const [data, total] = await Promise.all([BorrowRecord.find(filter).sort({ issueDate: -1 }).skip((page - 1) * limit).limit(limit).populate('book', 'title author isbn genre').lean({ virtuals: true }), BorrowRecord.countDocuments(filter)]);
  res.json({ success: true, data, meta: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1, member } });
});
module.exports = { issueBook, returnBook, memberHistory };
