const { z } = require("zod");
const objectId = z.string().regex(/^[a-fA-F\d]{24}$/, "Invalid identifier");
const issueSchema = z.object({
  bookId: objectId,
  memberId: objectId,
  dueDate: z.coerce.date().optional(),
});
const borrowIdParamSchema = z.object({ borrowId: objectId });
const historyQuerySchema = z.object({
  status: z.enum(["issued", "returned", "overdue"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
const borrowQuerySchema = z.object({
  status: z.enum(["issued", "returned", "overdue"]).optional(),
  search: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
module.exports = {
  issueSchema,
  borrowIdParamSchema,
  historyQuerySchema,
  borrowQuerySchema,
};
