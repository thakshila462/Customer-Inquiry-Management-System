function notFoundHandler(req, res, next) {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
}

function errorHandler(error, req, res, next) {
    console.error(error);

    if (res.headersSent) {
        return next(error);
    }

    // Duplicate email or other unique constraint violation.
    if (error.code === "23505") {
        return res.status(409).json({
            success: false,
            message: "A record with this value already exists.",
        });
    }

    // PostgreSQL foreign-key constraint violation.
    if (error.code === "23503") {
        return res.status(400).json({
            success: false,
            message: "The referenced record does not exist.",
        });
    }

    return res.status(500).json({
        success: false,
        message: "An unexpected server error occurred.",
    });
}

module.exports = {
    notFoundHandler,
    errorHandler,
};