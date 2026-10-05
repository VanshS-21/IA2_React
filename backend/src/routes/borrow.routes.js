const router = require('express').Router();
const { issueBook, returnBook } = require('../controllers/borrow.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { issueSchema, borrowIdParamSchema } = require('../validators/borrow.schema');
router.use(protect);
router.post('/', validate(issueSchema), issueBook);
router.post('/return/:borrowId', validate(borrowIdParamSchema, 'params'), returnBook);
module.exports = router;
