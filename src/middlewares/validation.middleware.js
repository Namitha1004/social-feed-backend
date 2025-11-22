export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: result.error.errors,
        });
      }

      req.validated = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

