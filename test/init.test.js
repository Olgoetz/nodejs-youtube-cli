process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const init = require('../lib/init');

const mock = require('mock-fs');

beforeEach(() => {
	mock({
		files: {
			'default.json': '{"audioDir":"myPath"}',
		},
	});
});

describe('validateConfig()', () => {
	it('should return true', () => {
		expect(init.validateConfig('files/default.json')).to.be.true;
	});
	it('should return false', () => {
		expect(init.validateConfig('files/no.json')).to.be.false;
	});
});

describe('createFolder()', () => {
	it('should return false', () => {
		expect(init.createFolder('files')).to.be.false;
	});
	it('should return true', () => {
		expect(init.createFolder('/fakePath')).to.equal(true);
	});
});

describe('createConfig()', () => {
	it('should return true', () => {
		expect(init.createConfig('/files', './files/default.json')).to.equal(true);
	});
});

mock.restore();
