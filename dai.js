var fs = require('fs');
var request = require('request');
var env = require('./env.js');
var key = env.api_key;

let threshold = 0.5; // Confidence 
let source = './source/' // Source folder.
let image = 'wallhaven-603706.jpg'; // Specific image to test.
let sketchy;

request.post({
	url: 'https://api.deepai.org/api/nsfw-detector',
	formData: {
		image: fs.createReadStream(source + image),
	},
	headers: {
		'Api-Key': key
	}
}, function callback(err, httpResponse, body) {
	if (err) {
		return console.error('request failed:', err);
	}
	var response = JSON.parse(body);
	var score = parseFloat(response["output"]["nsfw_score"]);
	(score > threshold) ? sketchy = true: sketchy = false; 
	(sketchy) ? 
		console.log(`This is a sketchy image. It has a score of ${score}.`) :
		console.log(`This image is likely safe. It has a score of ${score}. Moving file to public folder.`);
	(sketchy) ?
		fs.copyFile(__dirname + `/${source + image}`, __dirname + `/private/${image}`, (err) => {
			if (err) throw err;
			console.log('Copying file to private.');
		})
			:
		fs.copyFile(__dirname + `/${source + image}`, __dirname + `/public/${image}`, (err) => {
			if (err) throw err;
			console.log('Copying file to public.');
		})
});
