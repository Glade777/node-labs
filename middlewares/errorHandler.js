function errorHandler(err, req, res, next) {
    console.error(err);

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.status || 500;

    return res.status(statusCode).json({
        error: statusCode === 500 ? "Internal server error" : err.message,
    });
}

module.exports = errorHandler;