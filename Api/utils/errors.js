export class ParameterError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ParameterError';
    }
}

export class ConectionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConectionError';
    }
}

export class InternalError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InternalError';
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}
