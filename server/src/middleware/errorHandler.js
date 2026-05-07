const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`); // log error server-side

  // SQL duplicate error
  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({ message: "Duplicate entry" });
  }

  const status = err.status || err.statusCode || 500;
  const isDev = process.env.NODE_ENV === 'development';

  res.status(status).json(
    isDev
      ? {
          message: err.message,
          stack: err.stack,
          status
        }
      : {
          message: 'Internal server error' // never leak details in production
        }
  );
};

export default errorHandler;
