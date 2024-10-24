export class ParameterError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ParameterError';
        this.statusCode = 400;
    }
}

export class ConectionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConectionError';
        this.statusCode = 503;
    }
}

export class InternalError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InternalError';
        this.statusCode = 500;
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

export class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = 403;
    }
}

export class UnauthenticatedError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UnauthenticatedError';
        this.statusCode = 401;
    }
}
