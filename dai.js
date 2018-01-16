var fs = require('fs');
var request = require('request');
var env = require('./env.js');
var key = env.api_key;

let threshold = 0.5; 
let source = './source/' 

var walkSync = function(dir, filelist) {
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + file).isDirectory()) {
      filelist = walkSync(dir + file + '/', filelist);
    }
    else {
      filelist.push(file);
    }
  });
  return filelist;
};

let images = (walkSync(source));

for (let i = 0; i < images.length; i++)  {
	AI(images[i]);
}

function AI(fileName) {
	let image = fileName;
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
			console.log(`This image is likely safe. It has a score of ${score}.`);
		(sketchy) ?
			fs.copyFile(__dirname + `/${source + image}`, __dirname + `/private/${image}`, (err) => {
				if (err) throw err;
				console.log(`Copying ${image} to private.`);
			})
				:
			fs.copyFile(__dirname + `/${source + image}`, __dirname + `/public/${image}`, (err) => {
				if (err) throw err;
				console.log(`Copying ${image} to public.`);
			})
	});
};
