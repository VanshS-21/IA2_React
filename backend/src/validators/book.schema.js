const { z } = require('zod');
const isbn = z.string().trim().refine((value) => /^(?:\d{9}[\dXx]|\d{13})$/.test(value.replace(/-/g, '')), 'ISBN must be valid ISBN-10 or ISBN-13');
const createBookSchema = z.object({ title: z.string().trim().min(1).max(200), author: z.string().trim().min(1), isbn, genre: z.string().trim().min(1), totalCopies: z.coerce.number().int().min(1), availableCopies: z.coerce.number().int().min(0).optional() }).refine((data) => data.availableCopies === undefined || data.availableCopies <= data.totalCopies, { path: ['availableCopies'], message: 'availableCopies cannot exceed totalCopies' });
const bookQuerySchema = z.object({ page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(10), genre: z.string().trim().optional(), search: z.string().trim().optional(), sort: z.string().regex(/^-?(createdAt|title|author|genre)$/).default('-createdAt') });
module.exports = { createBookSchema, bookQuerySchema };
