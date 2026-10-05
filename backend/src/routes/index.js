const router = require('express').Router();
router.use('/auth', require('./auth.routes'));
router.use('/books', require('./book.routes'));
router.use('/members', require('./member.routes'));
router.use('/borrow', require('./borrow.routes'));
router.get('/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));
module.exports = router;
