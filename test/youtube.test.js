process.env.NODE_ENV = 'test';

// NMP modules
const expect = require('chai').expect;

// Custom modules
const youtube = require('../lib/youtube');

// Setup tests
const url = 'https://www.youtube.com/watch?v=Np8ibIagn3M';

describe('getInfo()', () => {
	it('should return a non empty string', async () => {
		const result = await youtube.getInfo(url);
		expect(result).not.empty;
	});
});

describe('getStream()', () => {
	it('should return a readable stream as object', async () => {
		const result = await youtube.getStream(url);
		expect(typeof result).to.equal('object');
	});
});
