export const successResponse = (res, data = null, options = {}) => {
  const response = {
    success: true,
    data,
  };

  if (options.message) response.message = options.message;
  if (options.pagination) response.pagination = options.pagination;

  return res.status(200).json(response);
};
