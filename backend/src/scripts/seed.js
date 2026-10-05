const bcrypt = require('bcryptjs');
const { connectDb } = require('../config/db');
const Librarian = require('../models/Librarian');
const Book = require('../models/Book');
const Member = require('../models/Member');
const BorrowRecord = require('../models/BorrowRecord');

const titles = [
  ['The Left Hand of Darkness', 'Ursula K. Le Guin', '9780441478125', 'Science Fiction'], ['Pachinko', 'Min Jin Lee', '9781455563937', 'Fiction'], ['The Dispossessed', 'Ursula K. Le Guin', '9780061054884', 'Science Fiction'], ['Beloved', 'Toni Morrison', '9781400033416', 'Fiction'], ['Braiding Sweetgrass', 'Robin Wall Kimmerer', '9781571313560', 'Nature'], ['A Brief History of Time', 'Stephen Hawking', '9780553380163', 'Science'], ['The Art of War', 'Sun Tzu', '9781590302255', 'History'], ['The Design of Everyday Things', 'Don Norman', '9780465050659', 'Design'], ['Invisible Women', 'Caroline Criado Perez', '9781419729072', 'History'], ['The Night Circus', 'Erin Morgenstern', '9780307744432', 'Fantasy'], ['Kindred', 'Octavia E. Butler', '9780807083697', 'Science Fiction'], ['The Song of Achilles', 'Madeline Miller', '9780062060624', 'Fantasy'], ['Atomic Habits', 'James Clear', '9780735211292', 'Self Help'], ['Sapiens', 'Yuval Noah Harari', '9780062316097', 'History'], ['The Overstory', 'Richard Powers', '9780393356687', 'Nature'], ['Educated', 'Tara Westover', '9780399590504', 'Memoir'], ['The Code Book', 'Simon Singh', '9780385495325', 'Science'], ['Jane Eyre', 'Charlotte Bronte', '9780141441146', 'Classic'], ['The Odyssey', 'Homer', '9780140268867', 'Classic'], ['The Name of the Wind', 'Patrick Rothfuss', '9780756404741', 'Fantasy'], ['The Lean Startup', 'Eric Ries', '9780307887894', 'Business'], ['Thinking, Fast and Slow', 'Daniel Kahneman', '9780374533557', 'Psychology'], ['The Warmth of Other Suns', 'Isabel Wilkerson', '9780679763888', 'History'], ['The Anthropocene Reviewed', 'John Green', '9780525555216', 'Essays'], ['Dune', 'Frank Herbert', '9780441172719', 'Science Fiction']
];
async function seed() {
  await connectDb();
  await Promise.all([Librarian.deleteMany({}), Book.deleteMany({}), Member.deleteMany({}), BorrowRecord.deleteMany({})]);
  const librarian = await Librarian.create({ name: 'Morgan Reed', email: 'librarian@shelflife.test', passwordHash: await bcrypt.hash('Passw0rd!', 10) });
  const books = await Book.insertMany(titles.map(([title, author, isbn, genre], index) => ({ title, author, isbn, genre, totalCopies: index === 0 ? 1 : 2 + (index % 4) })));
  const members = await Member.insertMany(['Anika Shah', 'Diego Santos', 'Meera Patel', 'Noah Williams', 'Riya Nair', 'Omar Khan', 'Ella Martin', 'Sam Chen'].map((name, index) => ({ name, email: `${name.toLowerCase().replace(' ', '.')}@example.test`, membershipId: `MEM-${String(index + 1).padStart(4, '0')}A` })));
  const past = new Date(); past.setDate(past.getDate() - 21);
  const due = new Date(); due.setDate(due.getDate() - 7);
  await BorrowRecord.create([{ book: books[1]._id, member: members[0]._id, issueDate: past, dueDate: due, issuedBy: librarian._id, status: 'overdue' }, { book: books[2]._id, member: members[1]._id, issueDate: past, dueDate: due, issuedBy: librarian._id, status: 'overdue' }]);
  await Book.updateMany({ _id: { $in: [books[1]._id, books[2]._id] } }, { $inc: { availableCopies: -1 } });
  console.log('Seeded librarian, 25 books, 8 members, and overdue loans.');
  process.exit(0);
}
seed().catch((error) => { console.error(error); process.exit(1); });
