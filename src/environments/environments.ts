const {
	NODE_ENV,
	CLIENT_URL_DEV,
	CLIENT_URL_PROD,
	DB_HOST_DEV,
	DB_PORT_DEV,
	DB_USERNAME_DEV,
	DB_PASSWORD_DEV,
	DB_NAME_DEV,
	DB_HOST_PROD,
	DB_PORT_PROD,
	DB_USERNAME_PROD,
	DB_PASSWORD_PROD,
	DB_NAME_PROD,
	SERVER_HOST_DEV,
	SERVER_HOST_PROD,
} = process.env;

const DEV_MODE = NODE_ENV === "development";

// Database Variables
export const DB_PORT = DEV_MODE ? DB_PORT_DEV : DB_PORT_PROD;
export const DB_USERNAME = DEV_MODE ? DB_USERNAME_DEV : DB_USERNAME_PROD;
export const DB_PASSWORD = DEV_MODE ? DB_PASSWORD_DEV : DB_PASSWORD_PROD;
export const DB_NAME = DEV_MODE ? DB_NAME_DEV : DB_NAME_PROD;
export const DB_HOST = DEV_MODE ? DB_HOST_DEV : DB_HOST_PROD;

// Client Info
export const CLIENT_URL = DEV_MODE ? CLIENT_URL_DEV : CLIENT_URL_PROD;

// Server Info
export const SERVER_HOST = DEV_MODE ? SERVER_HOST_DEV : SERVER_HOST_PROD;
export const { SERVER_PORT } = process.env;

// Social Authentication Variables
export const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
export const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

// Jsonwebtoken Secret
export const { JWT_SECRET } = process.env;

// Default Values
export const { DEFAULT_PHOTO_PROFILE } = process.env;
console.log({ env: process.env });
