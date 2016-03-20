// parse emojifile.js and output emoji.json
var fs = require('fs'),
    path = require('path'),
    emoji = require('./emojifile').data;

// parse
var parsed_emoji = {};

var data;
for (var key in emoji) {
  data = emoji[key];
  parsed_emoji[data[3][0]] = data[0][0];
}

// write to emoji.json
fs.writeFile(path.join(__dirname, 'emoji.json'), JSON.stringify(parsed_emoji), function(err) {
  if(err) {
    console.error('Error:', err);
  } else {
    console.log('Done.');
  }
});