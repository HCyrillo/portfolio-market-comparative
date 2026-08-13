const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

chai.use(chaiAsPromised);
global.expect = chai.expect;

module.exports = {};
