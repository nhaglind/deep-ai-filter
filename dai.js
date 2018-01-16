var fs = require('fs');
var request = require('request');
var env = require('./env.js');
var key = env.api_key;

let threshold = 0.5; 
let source = './source/' 

var walkSync = function(dir, filelist) {
  var path = path || require('path');
  var fs = fs || require('fs'),
      files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
          filelist = walkSync(path.join(dir, file), filelist);
      }
      else {
          filelist.push(path.join(dir, file));
      }
  });
  return filelist;
};

let images = (walkSync(source));

for (let i = 0; i < images.length; i++)  {
  AI(images[i]);
}

function AI(filePath) {
  let fullPath = filePath;
  let fileName = fullPath.split(/[/ ]+/).pop();
  let sketchy;
  request.post({
    url: 'https://api.deepai.org/api/nsfw-detector',
    formData: {
      image: fs.createReadStream(fullPath),
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
      fs.copyFile(__dirname + `/${fullPath}`, __dirname + `/private/${fileName}`, (err) => {
        if (err) throw err;
        console.log(`Copying ${fileName} to private.`);
      })
        :
      fs.copyFile(__dirname + `/${fullPath}`, __dirname + `/public/${fileName}`, (err) => {
        if (err) throw err;
        console.log(`Copying ${fileName} to public.`);
      })
  });
};
