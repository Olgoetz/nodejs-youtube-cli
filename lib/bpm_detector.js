const { AudioContext } = require('web-audio-api');
const decode = require('audio-decode');
const ctx = new AudioContext();
const fs = require('fs');
const { analyze } = require('web-audio-beat-detector');
const getAudioBuffer = async () => {
	try {
		const file = fs.readFileSync(
			'/Users/olivergoetz/YouTube-Audio-Downloads/Tu boca -  (Bachata Remix Dj Khalid).mp3'
		);
		const audioBuffer = await decode(file);
		//console.log(audioBuffer);
		return audioBuffer;
	} catch (err) {
		console.error(err);
	}
};

const detect = async () => {
	const audioBuffer = await getAudioBuffer();
	const tempo = await audioBuffer;
};
