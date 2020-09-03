process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const youtube = require('../lib/youtube');

describe('getInfo()', () => {
	it('should return a non empty string', async () => {
		const url = 'https://www.youtube.com/watch?v=Np8ibIagn3M';
		const result = await youtube.getInfo(url);
		expect(result).not.empty;
	});
});

describe('getStream()', () => {
	it('should return a readable stream as object', async () => {
		const url = 'https://www.youtube.com/watch?v=Np8ibIagn3M';
		const result = await youtube.getStream(url);

		expect(typeof result).to.equal('object');
	});
});
