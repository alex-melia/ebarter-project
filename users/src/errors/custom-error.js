class CustomError extends Error {
	constructor(message) {
		super(message);
		Object.setPrototypeOf(this, CustomError.prototype);
	}

	serializeErrors() {
		throw new Error({ message: String, field: String });
	}
}

module.exports = CustomError;
