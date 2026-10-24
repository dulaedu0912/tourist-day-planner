// Wraps async controllers so any thrown error reaches the error middleware (Express 4).
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
