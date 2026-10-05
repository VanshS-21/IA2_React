const router = require("express").Router();
const {
  issueBook,
  returnBook,
  listBorrowRecords,
} = require("../controllers/borrow.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  issueSchema,
  borrowIdParamSchema,
  borrowQuerySchema,
} = require("../validators/borrow.schema");
router.use(protect);
router.get("/", validate(borrowQuerySchema, "query"), listBorrowRecords);
router.post("/", validate(issueSchema), issueBook);
router.post(
  "/return/:borrowId",
  validate(borrowIdParamSchema, "params"),
  returnBook,
);
module.exports = router;
