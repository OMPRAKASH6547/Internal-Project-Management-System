export function validate(schema) {
  return async (req, res, next) => {
    try {
      req.validatedBody = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error?.name === "ZodError") {
        return res.status(422).json({
          error: "Validation failed",
          details: error.flatten(),
        });
      }
      return next(error);
    }
  };
}
