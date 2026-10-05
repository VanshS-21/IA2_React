const { z } = require('zod');
const createMemberSchema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().email(), membershipId: z.string().trim().min(1).optional(), joinedDate: z.coerce.date().optional() });
const memberQuerySchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20), search: z.string().trim().optional() });
const idParamSchema = z.object({ id: z.string().regex(/^[a-fA-F\d]{24}$/, 'Invalid identifier') });
module.exports = { createMemberSchema, memberQuerySchema, idParamSchema };
