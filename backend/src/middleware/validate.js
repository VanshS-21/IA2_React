function validate(schema, source = 'body') {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Request validation failed', details: parsed.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })) } });
    }
    req[source] = parsed.data;
    return next();
  };
}
module.exports = validate;
