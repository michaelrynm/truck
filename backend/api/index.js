// Vercel Serverless Function Entry Point
require('dotenv').config();
const app = require('../src/app');

module.exports = app;
