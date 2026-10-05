const router = require('express').Router();
const { createBook, listBooks, genres } = require('../controllers/book.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createBookSchema, bookQuerySchema } = require('../validators/book.schema');
router.get('/genres', genres);
router.get('/', validate(bookQuerySchema, 'query'), listBooks);
router.post('/', protect, validate(createBookSchema), createBook);
module.exports = router;
